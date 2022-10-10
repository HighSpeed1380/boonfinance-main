import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthQuery } from '../../home/state/auth.query';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private router: Router, private sessionQuery: AuthQuery) { }

    canActivate(): boolean {
        if (this.sessionQuery.isLoggedIn()) {
            return true;
        }
        this.router.navigateByUrl('login');
        return false;
    }
}
