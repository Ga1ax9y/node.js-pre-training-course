import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { LoggerService } from '../../../logger/logger/logger.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly logger: LoggerService) { }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    this.logger.log('[GUARD] AdminGuard: access check', 'AdminGuard');

    const request = context.switchToHttp().getRequest();
    const isAdmin = request.headers['x-admin'] === 'true';

    if (!isAdmin) {
      this.logger.warn('[GUARD] Access denied — missed header x-admin: true', 'AdminGuard');
      throw new ForbiddenException('Admin access required (send header x-admin: true)');
    }

    this.logger.log('[GUARD] Access granted', 'AdminGuard');
    return true;
  }
}
