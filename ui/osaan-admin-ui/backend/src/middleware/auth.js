import { auth } from 'express-openid-connect';
import { appConfig, isKeycloakEnabled } from '../config/env.js';
import { createSession } from '../config/session.js';

export function setupAuth(app) {
  if (!isKeycloakEnabled) {
    console.log('[Auth] Keycloak disabled');
    return;
  }

  const { keycloak, baseUrl } = appConfig;
  const { sessionMiddleware, store, secret, cookie } = createSession();

  const config = {
    authRequired: false,
    auth0Logout: false,
    idpLogout: true,
    issuerBaseURL: keycloak.issuerBaseUrl,
    baseURL: baseUrl,
    secret,
    clientID: keycloak.clientId,
    clientSecret: keycloak.clientSecret,
    authorizationParams: {
      response_type: 'code',
      scope: 'openid profile email',
    },
    session: {
      name: 'osaan.sid',
      store,
      rolling: true,
      cookie,
    },
  };

  app.set('trust proxy', 1);
  app.use(sessionMiddleware);
  app.use(auth(config));

  console.log('[Auth] Keycloak enabled');
}

export function requireLogin() {
  return (req, res, next) => {
    if (!isKeycloakEnabled) {
      return next();
    }

    const isAuthenticated = req.oidc?.isAuthenticated?.() || false;
    if (!isAuthenticated) {
      return res.redirect('/api/login');
    }

    if (req.oidc?.accessToken?.token) {
      req.session.tokens = {
        access_token: req.oidc.accessToken.token,
        refresh_token: req.oidc.refreshToken?.token || req.session?.tokens?.refresh_token || null,
      };
    }

    next();
  };
}
