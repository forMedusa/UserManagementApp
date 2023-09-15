// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ApiserviceService } from './apiservice.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private service: ApiserviceService, private router: Router) {}

  canActivate(): boolean {
    const isAuthenticated = this.service.hasValidToken();

    if (isAuthenticated) {
      return true;
    } else {
      this.router.navigate(['']);
      return false;
    }
  }
}
