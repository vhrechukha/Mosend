import { registerAs } from '@nestjs/config';

export default registerAs('application', () => ({
  port: process.env['APP_PORT'],
  db_host: process.env['DB_HOST'],
  db_password: process.env['DB_PASSWORD'],
  db_database: process.env['DB_DATABASE'],
  db_username: process.env['DB_USERNAME'],
  redis_host: process.env['REDIS_HOST'],
  redis_port: process.env['REDIS_PORT'],
}));
