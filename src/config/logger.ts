import pino from 'pino';
import { env } from './env.js';

const transport =
    env.NODE_ENV !== 'development'
        ? undefined
        : pino.transport({
              targets: [
                  {
                      target: 'pino-pretty',
                      level: 'debug',
                      options: {
                          colorize: true,
                          singleLine: true,
                          destination: 1,
                      },
                  },
              ],
          });

const logger = pino(
    {
        level: env.LOG_LEVEL,
        redact: {
            paths: [
                'req.body.password',
                'req.body.newPassword',
                'req.body.oldPassword',
                'req.body.token',
                'req.headers.authorization',
            ],
            censor: '*****',
        },
    },
    transport,
);

export default logger;
