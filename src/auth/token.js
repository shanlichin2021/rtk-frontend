import { useGoogleLogin } from "@react-oauth/google";

/**
 * Hook to trigger Google Sign‑In and stash the ID token in sessionStorage.
 */
export function useInitGoogleLogin() {
  const login = useGoogleLogin({
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
  return login;
}

/** Read the current ID token (if any) */
export function getIdToken() {
  return sessionStorage.getItem("id_token");
}
