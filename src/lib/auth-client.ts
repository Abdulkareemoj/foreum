import { createAuthClient } from "better-auth/react";
import {
  adminClient,
  usernameClient,
  emailOTPClient,
  oneTapClient,
} from "better-auth/client/plugins";
import { accessControl, adminRole, userAc } from "~/server/permissions";

export const authClient = createAuthClient({
  baseURL: process.env.BASE_URL!,
  fetchOptions: {
    credentials: "include", // This sends cookies with cross-origin requests
  },
  plugins: [
    adminClient({
      accessControl,
      roles: {
        admin: adminRole,
        user: userAc,
      },
    }),
    usernameClient(),
    oneTapClient({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      promptOptions: {
        maxAttempts: 1,
      },
    }),
    emailOTPClient(),
  ],
});

export const {
  signUp,
  signIn,
  signOut,
  useSession,
  getSession,
  forgetPassword,
  resetPassword,
  isUsernameAvailable,
  sendVerificationEmail,
  requestPasswordReset,
} = authClient;
