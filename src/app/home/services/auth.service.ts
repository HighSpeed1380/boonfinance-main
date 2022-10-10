import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { tap } from 'rxjs/operators';
import { AuthStore } from '../state/auth.store';
import { HotToastService } from '@ngneat/hot-toast';
import { Router } from  "@angular/router";
import { AngularFireAuth } from  "@angular/fire/auth";

export interface User {
  email: string;
  firstSignIn: boolean;
  firstName: string;
  lastName: string;
  token: string;
  plan: Plan;
  emailVerified: boolean;
  metadata: any[];
}

export interface Plan {
  planId: string;
  status: string;
}

@Injectable()
export class AuthService {

  loginUrl = environment.coreApi  + 'login';
  changePassUrl = environment.apiLocation  + 'user/change_password';

  constructor(
    private http: HttpClient,
    private authStore: AuthStore,
    private toastr: HotToastService,
    public  afAuth:  AngularFireAuth, 
    public  router:  Router
    ) { }


  login(username: string, password: string): any {
    return this.http.post<any>(this.loginUrl, { username, password }).pipe(
      tap( // Log the result or error
        (profile) => {
          this.authStore.update({
            user: profile
          });

          return profile;
        },
        (e) => {
          const error = e.error.error ? e.error.error : e.error;
          this.toastr.error( 'Try again: ' + error,{
            icon: '😐', 
          });
        })
    );
  }

  updatePassword(mail: string, pass: string): any {
    console.log('mail', mail);
    const body = {username: mail, password: pass};
    return this.http.post<any>(this.changePassUrl, body);
  }

   async sendPasswordResetEmail(passwordResetEmail: string) {
     return await this.afAuth.sendPasswordResetEmail(passwordResetEmail);
  }

}



