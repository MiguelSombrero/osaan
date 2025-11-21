import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });
}

if (process.env.NODE_ENV !== 'development') {
  await import('./tracing.js');
}

const { appConfig } = await import('./config/env.js');

const { app } = await import('./server.js');

console.log('Environment:', appConfig.env);

app.listen(appConfig.port, () => {
  console.log(`Server listening on port: ${appConfig.port}`);
});
