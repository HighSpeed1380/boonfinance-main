import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NG_ENTITY_SERVICE_CONFIG } from '@datorama/akita-ng-entity-service';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { AkitaNgRouterStoreModule } from '@datorama/akita-ng-router-store';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { HotToastModule } from '@ngneat/hot-toast';
import { AngularFireModule } from '@angular/fire';
import { DragDropFileUploadDirective } from './drag-drop-file-upload.directive';
 


const fConfig = {
  apiKey: "AIzaSyB4uS77ioilUB_3NNYlLrRJsOr0srjAu-4",
  authDomain: "booncloud.firebaseapp.com",
  databaseURL: "https://booncloud-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "booncloud",
  storageBucket: "booncloud.appspot.com",
  messagingSenderId: "451969015678",
  appId: "1:451969015678:web:5cd6f07264d06021ef1d2f",
  measurementId: "G-PKM9CRBEH9"
}
@NgModule({
  declarations: [
    AppComponent,
    DragDropFileUploadDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    environment.production ? [] : AkitaNgDevtools.forRoot(),
    AkitaNgRouterStoreModule.forRoot(),
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(fConfig),
    HotToastModule.forRoot(),
    
    
  ],
  providers: [
    { provide: NG_ENTITY_SERVICE_CONFIG, useValue: { baseUrl: 'https://jsonplaceholder.typicode.com' }}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
