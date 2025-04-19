// src/auth/token.js
let cached     = null;           // last ID‑token string
let expiryMs   = 0;              // epoch‑ms when it expires
let refreshing = null;           // Promise while fetching a new one

export async function getIdToken () {
  const now = Date.now();
  if (cached && now < expiryMs - 60_000) return cached;      // still fresh

  if (!refreshing) {
    refreshing = new Promise((resolve, reject) => {
      /* global google */
      google.accounts.oauth2
        .initTokenClient({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          scope: 'openid',                              // <- required, minimal
          audience: import.meta.env.VITE_CLOUD_RUN_AUDIENCE,
          callback: ({ access_token, expires_in, error, error_description }) => {
            refreshing = null;
            if (error) return reject(new Error(error_description || error));
            cached   = access_token;
            expiryMs = now + expires_in * 1000;
            resolve(cached);
          }
        })
        .requestAccessToken();
    });
  }
  return refreshing;
}
