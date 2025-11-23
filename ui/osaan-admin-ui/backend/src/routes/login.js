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
  res.json({ authenticated: true, user: req.oidc?.user || null });
});

export default router;
