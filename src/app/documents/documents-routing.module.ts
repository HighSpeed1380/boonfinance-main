import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';
import { DocumentsListComponent } from './components/documents-list/documents-list.component';
// Absolute path for sign in page
export const SIGN_IN_URL = '/auth/sign-in';

export const routes: Routes = [
  {
    path: '',
    component: DocumentsListComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentsRoutingModule { }
