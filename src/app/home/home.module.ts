import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from '../home/home-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SignInComponent } from '../home/sign-in/sign-in.component';
import { SignOutComponent } from '../home/sign-out/sign-out.component';
import { AuthService } from './services/auth.service';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HomeRoutingModule,
    SharedModule,
  ],
  declarations: [
    SignInComponent,
    SignOutComponent,
  ],
  providers: [AuthService]
})
export class HomeModule { }
