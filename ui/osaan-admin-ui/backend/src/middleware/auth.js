import { auth } from 'express-openid-connect';
import { appConfig, isKeycloakEnabled } from '../config/env.js';

export function setupAuth(app) {
  if (!isKeycloakEnabled) {
    console.log('[Auth] Keycloak disabled');
    return;
  }

  const { keycloak, session, baseUrl } = appConfig;

  if (!session.secret) {
    throw new Error('[Auth] Keycloak enabled but no session secret configured');
  }

  app.set('trust proxy', 1);

  const config = {
    authRequired: false,
    auth0Logout: false,
    idpLogout: true,
    issuerBaseURL: keycloak.issuerBaseUrl,
    baseURL: baseUrl,
    secret: session.secret,
    clientID: keycloak.clientId,
    clientSecret: keycloak.clientSecret,
    authorizationParams: {
      response_type: 'code',
      scope: 'openid profile email',
    },
    session: {
      rolling: true,
      cookie: {
        sameSite: 'Lax',
        secure: session.cookieSecure,
      },
    },
  };

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
