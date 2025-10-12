import dotenv from 'dotenv';
import { app } from './server.js';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });
}

console.log('Environment:', process.env.NODE_ENV);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
