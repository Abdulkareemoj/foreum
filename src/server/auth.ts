import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { emailOTP, oneTap, username } from "better-auth/plugins";
import { admin } from "better-auth/plugins/admin";

import { tanstackStartCookies } from "better-auth/tanstack-start";

import { db, schema } from "~/server/db";
import {
  resetConfirmTemplate,
  resetTemplate,
  verificationTemplate,
} from "~/lib/utils";

import { profile } from "~/server/db/schema/profile-schema";
import {
  accessControl,
  adminRole,
  moderatorRole,
  userAc,
} from "~/server/permissions";
import { createLogger } from "~/server/lib/logger";
import { createTransporter } from "~/server/lib/get-smtp-config";

const logger = createLogger('auth');

export const auth = betterAuth({
  appName: "Foreum",
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  trustedOrigins: process.env.TRUSTED_ORIGINS
    ? process.env.TRUSTED_ORIGINS.split(",").map((s) => s.trim())
    : ["http://localhost:3000"],
  plugins: [
    admin({
      defaultRole: "user",
      adminRoles: ["admin", "moderator"], // Both can access admin routes
      accessControl,
      roles: {
        admin: adminRole,
        moderator: moderatorRole,
        user: userAc,
      },
    }),
    username({
      minUsernameLength: 5,
      maxUsernameLength: 25,
      usernameValidator: (username) => /^[a-z0-9_-]+$/.test(username),
      usernameNormalization: (username) => {
        return username
          .trim()
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9_-]/g, "");
      },
      displayUsernameNormalization: (display) => display.trim(),
    }),
    oneTap(),
    // emailOTP(),
    tanstackStartCookies(),
  ],
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          try {
            await db.insert(profile).values({
              id: user.id,
              bio: "",
              location: "",
              website: "",
            });
            logger.info({ userId: user.id }, 'Profile created')
          } catch (err) {
            logger.error({ err }, 'Failed to create profile')
          }
        },
      },
    },
  },
  emailVerification: {
    async sendVerificationEmail({ user, url, token }, request) {
      try {
        const { transporter, from } = await createTransporter();
        await transporter.sendMail({
          from,
          to: user.email,
          subject: 'Verify your email address',
          html: verificationTemplate
            .replace("{{username}}", user.name || user.email)
            .replace(/{{url}}/g, url),
        });
        logger.info({ email: user.email }, 'Verification email sent');
      } catch (err) {
        logger.error({ err, email: user.email }, 'Failed to send verification email');
      }
    },
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expiresIn: 3600,
  },
  emailAndPassword: {
    enabled: true,
    async sendResetPassword({ user, url, token }, request) {
      try {
        const { transporter, from } = await createTransporter();
        await transporter.sendMail({
          from,
          to: user.email,
          subject: 'Reset your password',
          html: resetTemplate
            .replace("{{username}}", user.name || user.email)
            .replace(/{{url}}/g, url),
        });
        logger.info({ email: user.email }, 'Password reset link sent');
      } catch (err) {
        logger.error({ err, email: user.email }, 'Failed to send password reset');
      }
    },
    async onPasswordReset({ user }, request) {
      try {
        const { transporter, from } = await createTransporter();
        await transporter.sendMail({
          from,
          to: user.email,
          subject: 'Password Reset Confirmation',
          html: resetConfirmTemplate.replace(
            "{{username}}",
            user.name || user.email,
          ),
        });
        logger.info({ email: user.email }, 'Password reset confirmation sent');
      } catch (err) {
        logger.error({ err, email: user.email }, 'Failed to send reset confirmation');
      }
    },
    requireEmailVerification: true,
  },
  account: {
    accountLinking: {
      trustedProviders: ["google", "discord", "foreum"],
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    },
  },
});
