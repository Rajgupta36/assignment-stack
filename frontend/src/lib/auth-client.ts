import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "http://localhost:8000", // backend
});

export const { signIn, signOut, signUp, useSession } = authClient;
