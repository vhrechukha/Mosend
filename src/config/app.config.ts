import { registerAs } from '@nestjs/config';

export default registerAs('application', () => ({
  port: process.env['APP_PORT'],
  host: process.env['DB_HOST'],
  password: process.env['DB_PASSWORD'],
  database: process.env['DB_DATABASE'],
  username: process.env['DB_USERNAME'],
}));
