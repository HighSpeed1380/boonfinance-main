import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { from } from 'rxjs';
import { Router } from '@angular/router';
import { AuthStore } from '../state/auth.store';
import { HotToastService } from '@ngneat/hot-toast';
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  currentForm = 'login';
  firstLogin = false;
  loginForm: FormGroup;
  resetPasswordForm: FormGroup;
  modalRef: BsModalRef;
  loginLoading = false;
  resetPassTxt: any;
  inputPasswordType = 'password';
  config = {
    animated: true,
    class: 'modal-xl modal-fixed-footer'
  };
  constructor(
    private modalService: BsModalService,
    private auth: AuthService,
    private authStore: AuthStore,
    private router: Router,
    private toastr: HotToastService,
    private fb: FormBuilder) {}

  ngOnInit(): void {

    this.authStore.update({
      user: null
    });
    this.loginForm = this.fb.group({
      username: this.fb.control('', Validators.required),
      password: this.fb.control('', Validators.required)
    });


    this.resetPasswordForm = this.fb.group({
      email: this.fb.control('', [Validators.email, Validators.required]),
    });
  }

   openModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template, this.config);
  }

  login(): void {
    this.loginLoading = true;
    this.auth.login(this.loginForm.value.username , this.loginForm.value.password).subscribe(
      (data) => {
        if (data) {
          console.log('data', data);
          if (!data.firstSignIn) {
            this.router.navigate(['documents']);
          } else {
            this.firstLogin = true;
            this.resetPasswordForm.controls.email.setValue(this.loginForm.value.username);
            this.currentForm = 'resetPassword';
            this.resetPassTxt = {
              title: "First set a new password",
              message: "Click on reset password to set a new password for your account"
            };
          }
        }
      },
      (e) => {
        this.loginLoading = false;
        this.loginForm.controls.password.setValue('');
      }
    );
  }

  showPassword(): void {

    if (this.inputPasswordType === 'password') {
      this.inputPasswordType = 'text';
    } else {
      this.inputPasswordType = 'password';
    }
  }
  switchForm(form: string): void {
    this.firstLogin = false;
    this.currentForm = form;
    this.resetPassTxt = null;
  }

  resetPassword(): void {
    const email = this.resetPasswordForm.value.email;
    this.resetPassTxt = {
      title: 'We have just sent you a reset link',
      message: 'We have just sent a verification code to your email. If you don\'t see our email in your inbox, check your spam folder or get in touch with us'
    };
     
    this.auth.sendPasswordResetEmail(email).then( res => {
      this.resetPassTxt = {
        title: 'We just sent you a reset link',
        message: 'We just sent a verification code to your email. If you don\'t see our email in your inbox, check your spam folder or get in touch with us'
      };
    }, (e) => {
      this.resetPassTxt = {
        title: 'An error occured',
        message: 'Please try again or get in touch with us'
      };
    }) 
  }

  reload(): void {
    location.reload();
  }

}
