// backend/src/services/proxyService.js
import axios from 'axios';
import { appConfig, isKeycloakEnabled } from '../config/env.js';
import { ServiceUnavailableError } from '../utils/errors.js';

export async function callDownstream(req, method, path, data, params) {
  const token = req.oidc?.accessToken?.access_token;
  const type = req.oidc?.accessToken?.token_type || 'Bearer';

  try {
    return await axios.request({
      method,
      url: `${appConfig.targetApi}${path}`,
      data,
      params,
      headers: token && isKeycloakEnabled ? { Authorization: `${type} ${token}` } : undefined,
      validateStatus: () => true, // Let downstream errors pass through
      timeout: 30000,
    });
  } catch (err) {
    // Network errors, timeouts, etc.
    if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
      throw new ServiceUnavailableError('Downstream service is unavailable', req.originalUrl);
    }
    if (err.code === 'ECONNABORTED' || err.code === 'ETIMEDOUT') {
      throw new ServiceUnavailableError('Downstream service timed out', req.originalUrl);
    }
    throw err;
  }
}
