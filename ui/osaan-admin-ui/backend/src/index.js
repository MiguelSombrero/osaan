import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });
}

console.log('Environment:', process.env.NODE_ENV);

const PORT = process.env.PORT || 3000;

const { app } = await import('./server.js');

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
