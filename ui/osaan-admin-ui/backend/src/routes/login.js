import express from 'express';
import { appConfig } from '../config/env.js';

const router = express.Router();

router.get('/login', (_req, res) => {
  if (!appConfig.keycloak.enabled) {
    return res.status(404).json({ error: 'Login disabled' });
  }
  return res.oidc?.login({ returnTo: appConfig.loginRedirectUrl });
});

router.get('/logout', (_req, res) => {
  if (!appConfig.keycloak.enabled) {
    return res.status(200).json({ message: 'Logout noop (auth disabled)' });
  }
  return res.oidc?.logout({ returnTo: appConfig.logoutRedirectUrl });
});

router.get('/user', (req, res) => {
  if (!appConfig.keycloak.enabled) {
    return res.status(200).json({ authenticated: false, user: null, authDisabled: true });
  }

  const isAuth = req.oidc?.isAuthenticated?.() || false;
  if (!isAuth) return res.status(200).json({ authenticated: false });

  const accessToken = req.oidc.accessToken;
  const tokenString = accessToken?.access_token || accessToken;
  const decoded = decodeToken(tokenString);
  
  const roles = decoded?.realm_access?.roles || [];
  const userInfo = req.oidc?.user || {};

  const user = {
    name: userInfo.name,
    email: userInfo.email,
    username: userInfo.preferred_username,
    firstName: userInfo.given_name,
    lastName: userInfo.family_name,
  };

  res.json({ authenticated: true, user, roles });
});

function decodeToken(token) {
  if (!token) return null;
  try {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
  } catch (e) {
    console.error('Failed to decode token', e);
    return null;
  }
}

export default router;
