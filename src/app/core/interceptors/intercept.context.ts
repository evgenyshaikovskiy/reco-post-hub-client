import {HttpContext, HttpContextToken} from "@angular/common/http";

export const AUTH_INTERCEPT = new HttpContextToken(() => true);

export const AUTH_CONTEXT = new HttpContext();
AUTH_CONTEXT.set(AUTH_INTERCEPT, true);