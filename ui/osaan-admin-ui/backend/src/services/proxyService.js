import axios from 'axios';
import { appConfig, isKeycloakEnabled } from '../config/env.js';

export async function callDownstream(req, method, path, data, params) {
  const token = req.oidc?.accessToken?.access_token;
  const type = req.oidc?.accessToken?.token_type || 'Bearer';

  return axios.request({
    method,
    url: `${appConfig.targetApi}${path}`,
    data,
    params,
    headers: token && isKeycloakEnabled ? { Authorization: `${type} ${token}` } : undefined,
    validateStatus: () => true,
  });
}
