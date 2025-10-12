import axios from 'axios';

export function getAccessTokenFromSession(req) {
  return req.session?.tokens?.access_token || null;
}

export function getRefreshTokenFromSession(req) {
  return req.session?.tokens?.refresh_token || null;
}

export function setTokensToSession(req, tokens) {
  req.session.tokens = {
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token ?? getRefreshTokenFromSession(req),
    expires_in: tokens.expires_in,
    token_type: tokens.token_type || 'Bearer',
    obtained_at: Date.now()
  };
}

export async function refreshAccessToken(req) {
  const refreshToken = getRefreshTokenFromSession(req);
  if (!refreshToken) throw new Error('No refresh token in session');
  const tokenUrl = `${process.env.KEYCLOAK_ISSUER_BASE_URL}/protocol/openid-connect/token`;
  const params = new URLSearchParams();
  params.append('grant_type', 'refresh_token');
  params.append('refresh_token', refreshToken);
  params.append('client_id', process.env.KEYCLOAK_CLIENT_ID);
  if (process.env.KEYCLOAK_CLIENT_SECRET) {
    params.append('client_secret', process.env.KEYCLOAK_CLIENT_SECRET);
  }
  const resp = await axios.post(tokenUrl, params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
  setTokensToSession(req, resp.data);
  return resp.data.access_token;
}
