import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { LoggerService } from '../../logger/logger/logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;

    this.logger.log(`[INTERCEPTOR] Before handler: ${method} ${url}`, 'LoggingInterceptor');
    const start = Date.now();
    return next.handle().pipe(
      tap((data) => {
        const ms = Date.now() - start;
        this.logger.log(
          `[INTERCEPTOR] After handler: ${method} ${url} by ${ms}ms`,
          'LoggingInterceptor',);
      }),
    );

  }
}
