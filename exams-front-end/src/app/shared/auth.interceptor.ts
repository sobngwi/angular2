import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';

import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';



@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('AuthInterceptor Intercepted :', req);
    // const copiedReq = req.clone({headers: req.headers.set('', '')});
   // const copiedReq = req.clone({params: req.params.set('auth', this.authService.getToken())});
    return next.handle(req);
    // return null;
  }
}
