// src/auth/token.js
let cached = null;
let expiryMs = 0;
let refreshing = null;

/** 
 * Returns a Promise that resolves to an access token.
 * On first call it will pop the Google consent dialog.
 */
export async function getIdToken() {
  const now = Date.now();
  if (cached && now < expiryMs - 60_000) return cached;

  if (!refreshing) {
    refreshing = new Promise((resolve, reject) => {
      google.accounts.oauth2
        .initTokenClient({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          scope: "openid",
          audience: import.meta.env.VITE_CLOUD_RUN_AUDIENCE,
          callback: ({ access_token, expires_in, error, error_description }) => {
            refreshing = null;
            if (error) return reject(new Error(error_description || error));
            cached = access_token;
            expiryMs = now + expires_in * 1000;
            resolve(cached);
          },
        })
        .requestAccessToken();
    });
  }

  return refreshing;
}
