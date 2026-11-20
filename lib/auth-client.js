"use client";
import { createAuthClient } from "better-auth/react";

// Same-origin: /api/auth/* is proxied to the backend by next.config.mjs
export const authClient = createAuthClient({
  baseURL: typeof window !== "undefined" ? window.location.origin : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
});
