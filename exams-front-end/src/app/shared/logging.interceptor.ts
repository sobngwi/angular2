import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';

import { tap } from 'rxjs/operators';
import {Observable} from 'rxjs';

export class LoggingInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('Interceptor Logging Call ....');
    return next.handle(req).pipe(
      tap(
      event => {
        console.log('Logging interceptor event ', event);
      })
    );
  }
}
