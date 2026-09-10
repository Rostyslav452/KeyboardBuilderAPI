import logger from '../config/logger.js';
import { pinoHttp } from 'pino-http';
import crypto from 'crypto';
import { Request } from 'express';
import { IncomingMessage, ServerResponse } from 'http';

const requestLogger = pinoHttp({
   logger: logger,
   serializers: {
      req(req: IncomingMessage) {
         const expressReq = req as Request;

         let safeBody = undefined;
         if (expressReq.body && Object.keys(expressReq.body).length > 0) {
            safeBody = { ...expressReq.body };

            if (safeBody.password) safeBody.password = '****';
            if (safeBody.newPassword) safeBody.newPassword = '****';
         }

         return {
            method: expressReq.method,
            url: expressReq.url,
            ip: expressReq.ip,
            body: safeBody,
         };
      },
   },
   // eslint-disable-next-line @typescript-eslint/no-unused-vars
   genReqId: (req: IncomingMessage, res: ServerResponse) => {
      return req.id || crypto.randomUUID();
   },
   customLogLevel: (req: IncomingMessage, res: ServerResponse, err?: Error) => {
      if (res.statusCode >= 500 || err) return 'silent';
      return 'info';
   },
});

export default requestLogger;
