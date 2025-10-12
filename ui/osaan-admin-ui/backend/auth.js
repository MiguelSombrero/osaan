import { auth } from 'express-openid-connect';

const enabled = process.env.KEYCLOAK_ENABLED === 'true';

export function setupAuth(app) {
  if (!enabled) {
    console.log('[Auth] Keycloak disabled');
    return;
  }

  const config = {
    authRequired: false,
    auth0Logout: false,
    issuerBaseURL: process.env.KEYCLOAK_ISSUER_BASE_URL,
    baseURL: process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`,
    clientID: process.env.KEYCLOAK_CLIENT_ID,
    clientSecret: process.env.KEYCLOAK_CLIENT_SECRET || undefined,
    authorizationParams: {
      response_type: 'code',
      scope: 'openid profile email'
    }
  };

  app.use(auth(config));
  console.log('[Auth] Keycloak enabled');
}

/**
 * Middleware joka varmistaa että käyttäjä on kirjautunut sisään
 * Jos Keycloak on pois päältä, ohitetaan tarkistus
 */
export function requireLogin() {
  return (req, res, next) => {
    if (!enabled) {
      // Keycloak ei käytössä → aina hyväksytty
      return next();
    }

    const isAuth = req.oidc && req.oidc.isAuthenticated && req.oidc.isAuthenticated();
    if (!isAuth) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.oidc?.accessToken?.token) {
      req.session.tokens = {
        access_token: req.oidc.accessToken.token,
        refresh_token:
          req.oidc.refreshToken?.token ||
          req.session?.tokens?.refresh_token ||
          null
      };
    }

    next();
  };
}
