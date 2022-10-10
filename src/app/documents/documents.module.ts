import { NgModule, Pipe } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import {MatTooltipModule} from '@angular/material/tooltip';
import { DocumentsListComponent } from './components/documents-list/documents-list.component';
import { DocumentsRoutingModule } from './documents-routing.module';
import { DocumentsService } from './services/documents.service';
import { DocumentComponent } from './components/document/document.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import {TimeAgoPipe} from 'time-ago-pipe';
import { TeximateModule } from 'ngx-teximate';
import {RatingsPipe} from './ratings.pipe';
import {FormatCompanyPipe} from './formatCompany.pipe';
import {SentimentPercentPipe} from './sentimentPercent.pipe';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
@Pipe({
  name: 'timeAgo',
  pure: false
})
export class TimeAgoExtendsPipe extends TimeAgoPipe {}

@NgModule({
  declarations: [DocumentsListComponent, DocumentComponent, TimeAgoExtendsPipe, RatingsPipe, SentimentPercentPipe, FormatCompanyPipe],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DocumentsRoutingModule,
    SharedModule,
    TabsModule.forRoot(),
    ProgressbarModule.forRoot(),
    AccordionModule.forRoot(),
    BsDropdownModule.forRoot(),
    PdfViewerModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    TeximateModule
  ],
  providers: [DocumentsService]
})
export class DocumentsModule { }
