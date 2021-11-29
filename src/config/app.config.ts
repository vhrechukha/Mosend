import { registerAs } from '@nestjs/config';

export default registerAs('application', () => ({
  port: process.env['APP_PORT'],
}));
