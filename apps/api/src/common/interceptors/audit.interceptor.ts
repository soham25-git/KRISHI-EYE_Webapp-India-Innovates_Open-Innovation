import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
// import { AuditService } from '../../audit/audit.service'; 

@Injectable()
export class AuditInterceptor implements NestInterceptor {
    // constructor(private auditService: AuditService) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const req = context.switchToHttp().getRequest();
        const user = req.user;
        const method = req.method;
        const url = req.url;

        // We only want to log mutations usually, but let's just log setup here.
        return next.handle().pipe(
            tap(() => {
                if (method !== 'GET') {
                    console.log(`[AUDIT] User ${user?.id || 'anonymous'} performed ${method} on ${url}`);
                    // this.auditService.log(...)
                }
            }),
        );
    }
}
