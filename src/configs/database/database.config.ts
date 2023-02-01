import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT || 5432,
  database: process.env.DATABASE_DB,
  username: process.env.DATABASE_USERNAME || '',
  password: process.env.DATABASE_PASSWORD || '',
}));
