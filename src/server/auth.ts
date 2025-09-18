import { betterAuth } from 'better-auth';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { admin } from 'better-auth/plugins/admin';
import { oneTap, emailOTP, username } from 'better-auth/plugins';
import { db, schema } from '$server/db';
import {
	PUBLIC_GOOGLE_CLIENT_ID,
	PUBLIC_GOOGLE_CLIENT_SECRET,
	PUBLIC_DISCORD_CLIENT_ID,
	PUBLIC_DISCORD_CLIENT_SECRET
} from '$env/static/public';
import { getRequestEvent } from '$app/server';
import { profile } from './db/schema/profile-schema';
// import { organization } from "better-auth/plugins/organization";

// const from = process.env.BETTER_AUTH_EMAIL || "delivered@resend.dev";
// const to = process.env.TEST_EMAIL || "";

export const auth = betterAuth({
	appName: 'Foreum',
	database: drizzleAdapter(db, {
		provider: 'pg',
		schema
	}),
	plugins: [
		admin(),
		username({
			minUsernameLength: 5,
			maxUsernameLength: 25,
			usernameValidator: (username) => /^[a-z0-9_-]+$/.test(username),
			usernameNormalization: (username) => {
				return username
					.trim()
					.toLowerCase()
					.replace(/\s+/g, '-')
					.replace(/[^a-z0-9_-]/g, '');
			},
			displayUsernameNormalization: (display) => display.trim()
		}),
		// organization(),
		//     {
		//   async sendInvitationEmail(data) {
		//     await resend.emails.send({
		//       from,
		//       to: data.email,
		//       subject: "You've been invited to join an organization",
		//       react: reactInvitationEmail({
		//         username: data.email,
		//         invitedByUsername: data.inviter.user.name,
		//         invitedByEmail: data.inviter.user.email,
		//         teamName: data.organization.name,
		//         inviteLink:
		//           process.env.NODE_ENV === "development"
		//             ? `http://localhost:3000/accept-invitation/${data.id}`
		//             : `${
		//                 process.env.BETTER_AUTH_URL ||
		//                 "https://demo.better-auth.com"
		//               }/accept-invitation/${data.id}`,
		//       });
		//     });
		//   },
		// }
		oneTap(),
		emailOTP({
			async sendVerificationOTP({ email, otp, type }) {
				// For now, we'll just log the OTP to console
				// In production, you would send this via email service like Resend, SendGrid, etc.
				console.log(`[${type.toUpperCase()}] OTP for ${email}: ${otp}`);

				// Example with Resend (uncomment when you have email service configured):
				// await resend.emails.send({
				//   from: "noreply@yourdomain.com",
				//   to: email,
				//   subject: type === "sign-in" ? "Sign In OTP" : type === "email-verification" ? "Email Verification OTP" : "Password Reset OTP",
				//   html: `<p>Your OTP is: <strong>${otp}</strong></p><p>This code will expire in 5 minutes.</p>`,
				// });
			},
			otpLength: 6,
			expiresIn: 300, // 5 minutes
			allowedAttempts: 3,

			overrideDefaultEmailVerification: true
		}),
		sveltekitCookies(getRequestEvent)
	],
	databaseHooks: {
		user: {
			create: {
				after: async (user) => {
					try {
						await db.insert(profile).values({
							id: user.id,
							bio: '',
							location: '',
							website: ''
						});
						console.log(`✅ Profile created for user ${user.id}`);
					} catch (err) {
						console.error('❌ Failed to create profile:', err);
					}
				}
			}
		}
	},
	emailAndPassword: {
		enabled: true,
		// async sendResetPassword({ user, url }) {
		//   await resend.emails.send({
		//     from,
		//     to: user.email,
		//     subject: "Reset your password",
		//     react: reactResetPasswordEmail({
		//       username: user.email,
		//       resetLink: url,
		//     }),
		//   });
		// },
		onPasswordReset: async ({ user }, request) => {
			// your logic here
			console.log(`Password for user ${user.email} has been reset.`);
		}
	},
	account: {
		accountLinking: {
			trustedProviders: ['google', 'discord', 'foreum']
		}
	},
	socialProviders: {
		google: {
			clientId: PUBLIC_GOOGLE_CLIENT_ID || '',
			clientSecret: PUBLIC_GOOGLE_CLIENT_SECRET || ''
		},
		discord: {
			clientId: PUBLIC_DISCORD_CLIENT_ID || '',
			clientSecret: PUBLIC_DISCORD_CLIENT_SECRET || ''
		}
	},
	emailVerification: {
		// async
		sendVerificationEmail: async ({ user, url, token }) => {
			// const res = await resend.emails.send({
			//         from,
			//         to: to || user.email,
			//         subject: "Verify your email address",
			//         html: `<a href="${url}">Verify your email address</a>`,
			//       });
			//       console.log(res, user.email);
			//     },
		},
		sendOnSignUp: true,
		autoSignInAfterVerification: true,
		expiresIn: 3600 // 1 hour
	}
});
