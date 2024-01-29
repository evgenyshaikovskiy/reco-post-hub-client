import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [HttpClientModule],
  providers: [
    // { provide: HTTP_INTERCEPTORS, useClass: originApiInterceptor, multi: true },
  ],
})
export class InterceptorsModule {}
