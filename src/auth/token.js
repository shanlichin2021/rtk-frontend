// src/auth/token.js

/**
 * Returns a Promise that resolves to a Google ID token (JWT).
 * On first call it will pop the Google consent dialog; after that
 * it will return the cached token from sessionStorage.
 */
export function getIdToken() {
  const cached = sessionStorage.getItem("id_token");
  if (cached) {
    // you may want to verify expiry here, but skipping for brevity
    return Promise.resolve(cached);
  }

  return new Promise((resolve, reject) => {
    /* eslint-disable no-undef */
    google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: (resp) => {
        if (resp.credential) {
          sessionStorage.setItem("id_token", resp.credential);
          resolve(resp.credential);
        } else {
          reject(new Error("No ID token returned"));
        }
      },
      ux_mode: "popup",
      // optional: allowed_parent_origin: window.location.origin
    });
    google.accounts.id.prompt(); // this opens the popup
    /* eslint-enable no-undef */
  });
}
