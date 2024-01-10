import { Module, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Module({})
export class ReferrerPolicyModule implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        res.header('Access-Control-Allow-Origin', '*'); // You can specify the allowed origins instead of '*'
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
        res.header('Access-Control-Allow-Credentials', "true")
        if (req.method === 'OPTIONS') {
          res.sendStatus(200); // Pre-flight response for OPTIONS requests
        } else {
          next();
        }
        };
}
