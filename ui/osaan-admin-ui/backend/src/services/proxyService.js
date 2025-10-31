import axios from 'axios';
import { getAccessTokenFromSession, refreshAccessToken } from '../middleware/token.js';

const TARGET = process.env.TARGET_API || 'http://localhost:8092';

export async function callDownstream(req, method, path, data) {
  let accessToken = getAccessTokenFromSession(req);

  const run = async token =>
    axios.request({
      method,
      url: `${TARGET}${path}`,
      data,
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      validateStatus: () => true,
    });

  let resp = await run(accessToken);
  if ((resp.status === 401 || resp.status === 403) && process.env.KEYCLOAK_ENABLED === 'true') {
    try {
      const newToken = await refreshAccessToken(req);
      resp = await run(newToken);
    } catch {
      return resp;
    }
  }
  return resp;
}
