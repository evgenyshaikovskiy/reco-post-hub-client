import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { originApiInterceptor } from './origin.interceptor';

@NgModule({
  imports: [HttpClientModule],
  providers: [
    // { provide: HTTP_INTERCEPTORS, useClass: originApiInterceptor, multi: true },
  ],
})
export class InterceptorsModule {}
