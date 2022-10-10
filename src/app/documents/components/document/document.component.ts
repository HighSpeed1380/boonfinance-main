import { ChangeDetectorRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import { PdfViewerComponent } from 'ng2-pdf-viewer';
import { Document, SentenceModel } from '../../services/documents.service';
import { TextAnimation } from 'ngx-teximate';
import { flipInX } from 'ng-animate';
import { trigger, transition, useAnimation } from '@angular/animations';
import { tada } from 'ng-animate';
import { ViewportScroller } from '@angular/common';
@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss'],  
  animations: [
    trigger('tada', [transition('* => *', useAnimation(tada, {
      params: {
        timing: 2.5
      }
    }
    ))])
  ],
})

 
export class DocumentComponent implements OnInit {

  @ViewChild(PdfViewerComponent) private pdfComponent: PdfViewerComponent;

  toggleView = 'split';
  toggleRelevance = 'all';
  filteredSentences: any;
  filteredDocuments: any;
  selectedDocument: any;
  selectedSentence: any;
  base64File: string;
  nbSentenceText: string;
  zoom = 0.8;
  pdfZoomActiv: false;
  documentsCount: number;
  pdfLoading = false;
  pdfSource = "https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf";
  page: number;


  enterAnimation: TextAnimation = {
    animation: flipInX,
    delay: 15,
    type: "letter"
  };

  @Output() closeDocument: EventEmitter<string> = new EventEmitter();

  @Input() document: Document;
  @Input() pageNumber: number;
  @Input() sentence: SentenceModel;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private _vps: ViewportScroller
  ) { }

  ngOnInit(): void {
    this.pdfLoading = true;
    this.nbSentenceText = 'We found ' + this.document.sentences.length +' useful narratives for you'
     this.filteredSentences = this.document.sentences;
     if (this.sentence) {
      this.selectedSentence = {
        content: this.sentence.content,
        pageNumber: this.sentence.pageNumber,
        rating: this.sentence.rating,
        sentiment: this.sentence.sentiment,
      };

      console.log('id to scroll', 'sentence-' + this.sentence.id);
      this._vps.scrollToAnchor('sentence-' + this.sentence.id);

      console.log('selectedSentence after formatting', this.selectedSentence);

      
      this.changeDetector.markForCheck();
     }
  }

  updatePage(): void {
    this.pdfLoading = true;
    if (this.pageNumber) {
      this.page = this.pageNumber;
      this.pageNumber = null;
    }


    this.pdfLoading = false;

  }

  changeZoom(zoom): void {

    const docLink = this.document.link;
    this.document.link = null;
    this.pdfLoading = true;
      if (this.zoom = 0.8) {
        this.zoom = 1.1;
      } else {

        zoom = 0.8;
        this.changeDetector.detectChanges();
      }

      this.document.link = docLink;
      this.pdfLoading = false;

  }

  goToPdf(sentence: any): void {
    this.toggleView = 'split';
    this.pageNumber = sentence.pageNumber;
  }

  changeView(text: string): void {
    this.toggleView = text;
    this.page = null;
    this.changeDetector.detectChanges();
  }

  displayHighlights(text: string): void {
    //this.pdfViewer.find(text);
    this.pdfComponent.pdfFindController.executeCommand('find', {
      caseSensitive: false, findPrevious: undefined, highlightAll: true, phraseSearch: true, query: text
    });
  }

  selectSentence(index: number): void {
    this.selectedSentence = this.filteredSentences[index];
    console.log('selected sentence', this.selectedSentence);
    this.page = this.selectedSentence.pageNumber ? this.selectedSentence.pageNumber + 1 : undefined ;
    console.log('page', this.page);
    // this.displayHighlights(this.selectedSentence.content);
  }

  searchSentences(event: any): any {
    const searchText = event.target.value;
    this.filteredSentences = this.document.sentences.filter(e => {
      return e.content.toLowerCase().includes(searchText.toLowerCase());
    });
  }

  closeDoc(): void {
    this.closeDocument.emit('close');
  }
 
}
