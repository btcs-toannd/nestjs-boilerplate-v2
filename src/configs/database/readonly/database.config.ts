import { registerAs } from '@nestjs/config';

export default registerAs('readonlyDatabase', () => ({
  url: process.env.READONLY_DATABASE_URL || '',
}));
