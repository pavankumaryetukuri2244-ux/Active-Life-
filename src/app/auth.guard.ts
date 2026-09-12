import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      // Redirect to login page if not logged in
      return this.router.parseUrl('/pages/login-boxed');
    }

    const storedEmail = (localStorage.getItem('adminEmail') || '').trim().toLowerCase();
    const profileStr = localStorage.getItem('adminProfile');
    let profileEmail = '';
    if (profileStr) {
      try {
        const profile = JSON.parse(profileStr);
        profileEmail = (profile.email || profile.username || '').toLowerCase().trim();
      } catch (e) {
        // ignore parse error
      }
    }

    const email = storedEmail || profileEmail;

    // Role-based restrictions for testadmin@healthfamily.com
    if (email === 'testadmin@healthfamily.com') {
      const allowedRoutes = ['/dashboards/users', '/dashboards/content'];
      const targetUrl = (state?.url || '').split('?')[0];

      const isAllowed = allowedRoutes.some(allowed => targetUrl === allowed || targetUrl.startsWith(allowed + '/'));
      if (!isAllowed) {
        return this.router.parseUrl('/dashboards/users');
      }
    }

    return true;
  }
}

