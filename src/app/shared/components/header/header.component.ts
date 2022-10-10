import { Component, EventEmitter, OnInit, Output, TemplateRef } from '@angular/core';
import { AuthStore } from 'src/app/home/state/auth.store';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AuthService, User } from 'src/app/home/services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [AuthService]
})
export class HeaderComponent implements OnInit {

  username: string;
  passwordForm: FormGroup;
  currentUser: User;
  modalRef: BsModalRef;
  config = {
    animated: true,
    class: 'modal-xl modal-fixed-footer'
  };

  @Output() closeDocument: EventEmitter<string> = new EventEmitter();
  constructor(
    private authStore: AuthStore,
    private modalService: BsModalService,
    private auth: AuthService,
    private toastr: HotToastService,
    private router: Router,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.passwordForm = this.fb.group({
      password: this.fb.control('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: this.fb.control('', [Validators.required, Validators.minLength(8)])
    });

    this.currentUser = this.authStore.getValue().user;
    if (this.currentUser) {
      this.username = this.currentUser.firstName.charAt(0) + '' + this.currentUser.lastName.charAt(0);
    }
  }

  changePassword(): void {
    this.auth.sendPasswordResetEmail(this.currentUser.email).then( data => {
     this.toastr.success('Reset Password email has been sent',{
      icon: '👏', 
    });
     this.modalRef.hide();
     setTimeout(() => {
       this.logout();
     }, 500);
    },
    error => {
      this.toastr.error( 'Unable to send reset password email at the moment' ,{
        icon: '😐', 
      });
    });
  }

  logout(): void {
    this.authStore.update({user: null});
  }

  openModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template, this.config);
  }

  navigateTo(): void {
    location.reload();
  }

  navigateToHelp(template: TemplateRef<any>): void {
    const config = {
      animated: true,
      class: 'modal-xl modal-fixed-footer'
    };
    this.modalRef = this.modalService.show(template, config);
  }

  closeDoc(): void {
    this.closeDocument.emit('close');
  }
 
}
