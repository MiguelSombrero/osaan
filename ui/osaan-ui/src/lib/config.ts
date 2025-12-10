const bool = (value: string | undefined, fallback = false): boolean => {
  if (value === undefined) return fallback;
  return value.toLowerCase() === 'true';
};

const number = (value: string | undefined, fallback: number): number => {
  if (value === undefined) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const nodeEnv = process.env.NODE_ENV || 'development';

export const config = {
  env: nodeEnv,
  isDev: nodeEnv === 'development',
  isProd: nodeEnv === 'production',

  // URLs
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',

  // Microservice URLs (server-side only)
  skillCatalogApiUrl:
    process.env.SKILL_CATALOG_API_URL || 'http://localhost:8092',
  employeeApiUrl: process.env.EMPLOYEE_API_URL || 'http://localhost:8091',
  competenceProfileApiUrl:
    process.env.COMPETENCE_PROFILE_API_URL || 'http://localhost:8093',
  competenceMatchingApiUrl:
    process.env.COMPETENCE_MATCHING_API_URL || 'http://localhost:8094',

  // NextAuth
  nextAuth: {
    url: process.env.NEXTAUTH_URL || 'http://localhost:3000',
    secret: process.env.NEXTAUTH_SECRET || '',
  },

  // Keycloak
  keycloak: {
    enabled: bool(process.env.KEYCLOAK_ENABLED, false),
    issuer: process.env.KEYCLOAK_ISSUER || '',
    clientId: process.env.KEYCLOAK_CLIENT_ID || '',
    clientSecret: process.env.KEYCLOAK_CLIENT_SECRET || '',
  },

  // Redis
  redis: {
    enabled: bool(process.env.REDIS_ENABLED, false),
    host: process.env.REDIS_HOST || 'localhost',
    port: number(process.env.REDIS_PORT, 6379),
    password: process.env.REDIS_PASSWORD || undefined,
  },
} as const;

export const isKeycloakEnabled = config.keycloak.enabled;
export const isRedisEnabled = config.redis.enabled;
