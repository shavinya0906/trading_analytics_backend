import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { decodeToken } from './jwt.helper';

@Injectable()
export class ClientAuthGuard implements CanActivate {
  excludedRequests = [];
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.getArgByIndex(0);
      if (this.excludedRequests.includes(request.url.split('?')[0])) {
        return true;
      }
      const Authorization = request.headers['authorization'];
      if (!Authorization) {
        return false;
      }
      const token = Authorization.replace('Bearer ', '');
      const decode = await decodeToken(token);
      if (!decode) {
        throw {
          status: 500,
          message: 'Unauthorized client.',
        };
      }
      request.userId = decode;
      return true;
    } catch (e) {
      return false;
    }
  }
}
