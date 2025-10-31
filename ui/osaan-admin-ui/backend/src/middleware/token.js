import axios from 'axios';
import { appConfig } from '../config/env.js';

export function getRefreshTokenFromSession(req) {
  return req.session?.tokens?.refresh_token || null;
}

export function setTokensToSession(req, tokens) {
  req.session.tokens = {
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token ?? getRefreshTokenFromSession(req),
    expires_in: tokens.expires_in,
    token_type: tokens.token_type || 'Bearer',
    obtained_at: Date.now(),
  };
}
