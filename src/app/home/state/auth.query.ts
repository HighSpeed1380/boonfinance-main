import { Query } from '@datorama/akita';
import { AuthState, AuthStore } from './auth.store';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthQuery extends Query<AuthState> {
  isLoggedIn$ = this.select(state => !!state.user);

  isLoggedIn(): boolean {
    return !!this.getValue().user;
  }

  getToken(): string {
    return this.getValue().user ? this.getValue().user.token : null;
  }

  constructor(protected store: AuthStore) {
    super(store);
  }
}
