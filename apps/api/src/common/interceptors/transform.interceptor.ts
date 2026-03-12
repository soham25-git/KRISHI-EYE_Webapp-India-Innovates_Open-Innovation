import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { instanceToPlain } from 'class-transformer';

// Interceptor to strip out sensitive data like password/token hashes from response 
// using class-transformer's instanceToPlain (which obeys @Exclude annotations on entities)
@Injectable()
export class TransformInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map(data => instanceToPlain(data))
        );
    }
}
