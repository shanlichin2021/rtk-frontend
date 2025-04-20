// src/auth/token.js
import { useGoogleLogin } from "@react-oauth/google";

/**
 * Hook to launch Google Sign‑In and store the ID token in sessionStorage.
 */
export function useInitGoogleLogin() {
  return useGoogleLogin({
    flow: "implicit",
    scope: "openid email",
    onSuccess: (resp) => {
      // resp.credential is the Google ID token
      sessionStorage.setItem("id_token", resp.credential);
    },
    onError: () => {
      console.error("Google login failed");
    },
  });
}

/**
 * Getter for the stored ID token (or null if not signed in)
 */
export function getIdToken() {
  return sessionStorage.getItem("id_token");
}
