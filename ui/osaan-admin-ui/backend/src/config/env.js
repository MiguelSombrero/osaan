const bool = (value, fallback = false) => {
  if (value === undefined) return fallback;
  return value.toLowerCase() === 'true';
};

const number = (value, fallback) => {
  if (value === undefined) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const nodeEnv = process.env.NODE_ENV || 'development';
const port = number(process.env.PORT, 3000);

export const appConfig = {
  env: nodeEnv,
  port,
  baseUrl: process.env.BASE_URL || `http://localhost:${port}`,
  loginRedirectUrl: process.env.LOGIN_REDIRECT_URL || '/',
  logoutRedirectUrl: process.env.LOGOUT_REDIRECT_URL || process.env.LOGIN_REDIRECT_URL || '/',
  targetApi: process.env.TARGET_API || 'http://localhost:8092',
  cors: {
    enabled: bool(process.env.CORS_ENABLED, true),
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  },
  redis: {
    enabled: bool(process.env.REDIS_ENABLED, false),
    host: process.env.REDIS_HOST || 'localhost',
    port: number(process.env.REDIS_PORT, 6379),
    password: process.env.REDIS_PASSWORD || undefined,
  },
  session: {
    secret: process.env.SESSION_SECRET,
    cookieSecure:
      process.env.SESSION_COOKIE_SECURE === 'true'
        ? true
        : process.env.SESSION_COOKIE_SECURE === 'false'
        ? false
        : nodeEnv === 'production',
  },
  keycloak: {
    enabled: bool(process.env.KEYCLOAK_ENABLED, false),
    issuerBaseUrl: process.env.KEYCLOAK_ISSUER_BASE_URL,
    clientId: process.env.KEYCLOAK_CLIENT_ID,
    clientSecret: process.env.KEYCLOAK_CLIENT_SECRET || undefined,
  },
};

export const isKeycloakEnabled = appConfig.keycloak.enabled;
