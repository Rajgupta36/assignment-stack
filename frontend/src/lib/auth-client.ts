import { createAuthClient } from "better-auth/react";


const baseURL = import.meta.env.VITE_BETTER_AUTH_URL || "http://localhost:8000";
export const authClient = createAuthClient({
  baseURL: baseURL,
});

export const { signIn, signOut, signUp, useSession } = authClient;
