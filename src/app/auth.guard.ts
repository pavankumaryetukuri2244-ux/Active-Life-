import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    const token = localStorage.getItem('accessToken');
    const hasValidToken = !!token && token !== 'null' && token !== 'undefined' && token.trim().length > 10;
    const isLoggedIn = (localStorage.getItem('isLoggedIn') === 'true') || hasValidToken;
    if (!isLoggedIn) {
      // Redirect to login page if not logged in
      return this.router.parseUrl('/pages/login-boxed');
    }

    if (localStorage.getItem('isLoggedIn') !== 'true') {
      localStorage.setItem('isLoggedIn', 'true');
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
    const userRole = (localStorage.getItem('userRole') || '').trim().toUpperCase();
    let hasDoctorJwtRole = false;
    if (hasValidToken && token && token.includes('.')) {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
        const decoded = JSON.parse(atob(padded));
        const roles = decoded?.realm_access?.roles;
        hasDoctorJwtRole = Array.isArray(roles) && roles.includes('DOCTOR');
      } catch {
        hasDoctorJwtRole = false;
      }
    }

    const isDoctorSession = userRole === 'DOCTOR' || (hasDoctorJwtRole && !storedEmail);
    const targetUrl = (state?.url || '').split('?')[0];

    if (isDoctorSession) {
      const isDoctorRoute =
        targetUrl === '/doctor' ||
        targetUrl.startsWith('/doctor/') ||
        targetUrl === '/doctor-portal';
      if (!isDoctorRoute) {
        return this.router.parseUrl('/doctor/dashboard');
      }
      return true;
    }

    if (targetUrl === '/doctor' || targetUrl.startsWith('/doctor/') || targetUrl === '/doctor-portal') {
      const fallbackAdminRoute = email === 'testadmin@healthfamily.com' ? '/dashboards/users' : '/dashboards/analytics';
      return this.router.parseUrl(fallbackAdminRoute);
    }

    // Role-based restrictions for testadmin@healthfamily.com
    if (email === 'testadmin@healthfamily.com') {
      const allowedRoutes = ['/dashboards/users', '/dashboards/content'];

      const isAllowed = allowedRoutes.some(allowed => targetUrl === allowed || targetUrl.startsWith(allowed + '/'));
      if (!isAllowed) {
        return this.router.parseUrl('/dashboards/users');
      }
    }

    return true;
  }
}

