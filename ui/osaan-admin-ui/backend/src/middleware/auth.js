import { auth } from 'express-openid-connect';

const enabled = process.env.KEYCLOAK_ENABLED === 'true';

export function setupAuth(app) {
  if (!enabled) {
    console.log('[Auth] Keycloak disabled');
    return;
  }

  //app.set('trust proxy', 1);

  const config = {
    authRequired: false,
    auth0Logout: false,
    idpLogout: true,
    issuerBaseURL: process.env.KEYCLOAK_ISSUER_BASE_URL,
    baseURL: process.env.BASE_URL,
    secret: process.env.SESSION_SECRET,
    clientID: process.env.KEYCLOAK_CLIENT_ID,
    clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
    authorizationParams: {
      response_type: 'code',
    },
    session: {
      rolling: true,
      cookie: {
        sameSite: 'Lax',
        secure: false,
      },
    },
  };

  app.use(auth(config));
  console.log('[Auth] Keycloak enabled');
}
