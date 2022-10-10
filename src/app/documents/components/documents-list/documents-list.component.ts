import { AfterViewInit, ApplicationRef, ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { delay } from 'rxjs/operators';
import { DocumentQuery } from '../../state/document.query';
import { DocumentStore } from '../../state/document.store';
import { DocumentsService, Document, SentenceModel } from '../../services/documents.service';
import { TextAnimation } from 'ngx-teximate';
import { flipInX } from 'ng-animate';
import { trigger, transition, useAnimation } from '@angular/animations';
import { tada } from 'ng-animate';
import { HotToastService } from '@ngneat/hot-toast';
import { AuthStore } from 'src/app/home/state/auth.store';
import { User } from 'src/app/home/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-documents-list',
  templateUrl: './documents-list.component.html',
  styleUrls: ['./documents-list.component.scss'],
  animations: [
    trigger('zoomInLeft', [transition('* => *', useAnimation(tada, {
      params: {
        timing: 2.5
      }
    }
    ))])
  ],
})

export class DocumentsListComponent implements OnInit {
  documents: Document[];
  filteredDocs: Document[];

  public newDocuments: number[];
  loading = false;
  selectedClass: number;
  selectedSentence: SentenceModel;
  selectedDoc: Document;
  fileLoading: boolean;
  fileLoadingText ='Filtering...'
  fileToUpload: FileList = null;
  fileName: string;
  filteredSentences: any;
  sentences: any;
  nbSentenceText: string;
  pageNumber: number;
  sectors = [];
  countries = [];
  companies = [];
  currentUser: User;
  ratingFilter: any;
  loadSentence = true;

  docToRemove: Document;

  modalRef: BsModalRef;


  canUpload = true;
  uploadLimitToastr: any;
  enterAnimation: TextAnimation = {
    animation: flipInX,
    delay: 15,
    type: "letter"
  };

  filtersForm: FormGroup;

@ViewChild('successTemplate') successTemplate: any;
@ViewChild('errorTemplate') errorTemplate: any;

@ViewChild('fileFiel') attachment: any;

//Multiple File Upload Module
fileArr:any[] = [];
imgArr:string[] = [];
fileObj:any[] = [];

fileUpload:boolean=false;
//Multiple File Upload Module

  constructor(
    private authStore: AuthStore,
    private modalService: BsModalService,
    private documentsService: DocumentsService,
    private toastr: HotToastService,
    private documentStore: DocumentStore,
    private documentQuery: DocumentQuery,
    private changeDetector: ChangeDetectorRef,
    private fb: FormBuilder ,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit(): void {
    this.selectedDoc = null;
    this.newDocuments = [];
    this.ratingFilter = {
      sell: false,
      hold: false,
      buy: false
    };

    this.currentUser = this.authStore.getValue().user;

    this.getDocumentsAndSentences();

    const _this = this;
    setInterval(function() {
      _this.refreshDocuments();
    }, 10000);

    this.filtersForm = this.fb.group({
      buy: this.fb.control(false),
      hold: this.fb.control(false),
      sell: this.fb.control(false),
      sector: this.fb.control(null),
      company: this.fb.control(null),
      country: this.fb.control(null),
    });


    this.onFormChanges();

  }


  getDocumentsAndSentences(): void {
    this.getDocuments();
    setTimeout( () => {
      this.getSentences();
    }, 500)


    this.changeDetector.detectChanges();

  }

  checkIfCanUpload(): boolean {

    if (this.currentUser.plan.status == 'active') {
      if (this.currentUser.plan.planId == 'the-casual' || this.currentUser.plan.planId == 'free-plan') {
        if (this.documents && this.documents.length >= 5) {
         this.uploadLimitToastr = this.toastr.warning('You have reached your upload limit. Delete a document from your library or upgrade to upload more.',
          {
            autoClose: false,
            dismissible: true,
            position: 'bottom-center',
            style: {
              border: '1px solid red',
              color: 'red',
              width: '35%',
              maxWidth: '100%'
            },
            iconTheme: {
              primary: 'red',
              secondary: '#FFFAEE',
            },
          }
        );
          return false;
          
        } else {
          return true;
        }
      } else {
        return true;
      }
    } else {
      this.toastr.show('Your plan is not active. Conact us to continue using Boon Finance',
      {
        autoClose: false,
        dismissible: true,
        icon: '😐',
      });
      return false;
    } 
  
  }

  refreshDocuments(): void {
    this.documentsService.getDocuments().subscribe((res) => {
      this.documents = res;
      this.filteredDocs = res;
     // this.canUpload = this.checkIfCanUpload();
    });
  }

  getDocuments(loadSentence = true): void {
    //this.newDocuments = this.documentQuery.getNewDocuments();
    this.documentsService.getDocuments().subscribe((res) => {
      this.documents = res;
      this.filteredDocs = res;
      this.canUpload = this.checkIfCanUpload();
      console.log('canUpload', this.canUpload)
      if (loadSentence) this.loadSentence = true;
      res.map( (doc) => {
        if (doc.companies) {
          doc.companies.forEach( c => {
            if (this.sectors.includes(c.sector) === false ) {
              this.sectors.push(c.sector);
            }
  
            if (this.companies.includes(c.quoteBloomberg[0]) === false ) {
              this.companies.push(c.quoteBloomberg[0]);
            }
  
            if (this.countries.includes(c.country) === false ) {
              this.countries.push(c.country);
            }
          })
        }
       
      })
    }, (e) => {
      if (loadSentence) this.loadSentence = false;
    });


  }

  getSentences(): void {
    this.documentsService.getSentences().subscribe((res) => {
      this.nbSentenceText = 'We found ' + res.length +' useful narratives for you'
      this.sentences = res.map(s => {

        let doc = null;
        if (this.documents) {
          doc = this.documents.find(e => {
            return s.documentId === e.id
          });
        }
        return {
          ...s,
          document: doc ? doc : null
        }
      })
      this.loadSentence = false;
      this.filteredSentences = this.sentences;
      console.log('filteredSentences', this.filteredSentences)

    }, 
    (e) => {
      this.loadSentence = false;
    });
  }

  selectDocument(id: number, pageNumber?: number, sentence?: SentenceModel): void {
    this.pageNumber = pageNumber;
    this.loading = true;
    console.log('sentence to preselect', sentence);
    this.selectedSentence = sentence ? sentence : null;
    this.selectedClass = id;
    this.documentsService.getOneDocument(id).subscribe((data) => {
      this.selectedDoc = data;
      this.loading = false;
    });
  }

  onClose() {
    this.loading = true;
    this.selectedClass = null;
    this.pageNumber = null;
    this.selectedDoc = null;
    this.loading = false;
    this.filteredSentences = this.sentences;
  }


  searchSentences(event: any): any {
    const searchText = event.target.value;
    this.filteredSentences = this.sentences.filter(e => {
      return e.content.toLowerCase().includes(searchText.toLowerCase());
    });
  }

  searchDocs(event: any): any {
    const searchText = event.target.value
      ? event.target.value.toLowerCase()
      : '';
    this.filteredDocs = this.documents.filter((e) => {
      const companyList = e.companies.map((c) => c.quoteBloomberg[0].toString().split(" ")[0].toLowerCase());
      
      return (
        e.filename.toLowerCase().includes(searchText) ||
        companyList.includes(searchText)
      );
    });
  }



  async uploadFile(file: FileList): Promise<void> {
    // this.beforeUpload();
    //await delay(1500);
    this.fileToUpload = file;
    this.fileName = file[0].name;
  }


  //Multiple File Upload Module
  upload(e:any) {

    
  this.fileUpload=true;
    
    if(e.files == undefined){
      e = e;
    }
     if(e.files != undefined){
       
      e = e.files
    }

    if(e.length >10){
      console.log('max limit reached,Please attach files upto 10')
      return
    }
    
    
    if(this.fileArr.length + e.length <=10){
    
    const fileListAsArray = Array.from(e);
 
    fileListAsArray.forEach((item:any, i) => {
      const file:any = (e as HTMLInputElement);
      const url = URL.createObjectURL(file[i]);
      this.imgArr.push(url);
      this.fileArr.push({ item, url: url });
    })

   
   
    this.fileArr.forEach((item:any) => {
      this.fileObj.push(item.item)
    })

   

  }

  else{
    console.log('max limit reached,Please attach files upto 10')
      return
  }

    // Set files form control

    // this.form.patchValue({
    //   avatar: this.fileObj
    // })

    //this.form.get('avatar').updateValueAndValidity()

    // Upload to server
    // this.dragdropService.addFiles(this.form.value.avatar)
    //   .subscribe((event:any) => {
    //     switch (event.type) {
    //       case HttpEventType.Sent:
    //         console.log('Request has been made!');
    //         break;
    //       case HttpEventType.ResponseHeader:
    //         console.log('Response header has been received!');
    //         break;
    //       case HttpEventType.UploadProgress:
    //         this.progress = Math.round(event.loaded / event.total * 100);
    //         console.log(`Uploaded! ${this.progress}%`);
    //         break;
    //       case HttpEventType.Response:
    //         console.log('File uploaded successfully!', event.body);
    //         setTimeout(() => {
    //           this.progress = 0;
    //           this.fileArr = [];
    //           this.fileObj = [];
    //           this.msg = "File uploaded successfully!"
    //         }, 3000);
    //     }
    //   })
  }
//Delete From Multiple Files
removeSelectedFile(index:any) {
  // Delete the item from fileNames list
  this.fileObj.splice(index, 1);
  // delete file from FileList
  this.fileArr.splice(index, 1);

  if(this.fileArr.length == 0){
    this.attachment.nativeElement.value ='' ;
    this.fileUpload=false;
  }
  

 }


  // Clean Url
  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
 //Multiple File Upload Module


  submitFile(){
    
    

    for(let a=0;a<this.fileObj.length;a++){
      this.fileLoading = true;

      this.fileToUpload = this.fileObj[a];
    this.fileName = this.fileObj[a].name;



    this.documentsService.upload(this.fileObj[a]).pipe(this.toastr.observe(
      {
        loading: 'Processing the document, this may take a few moments.',
        success: this.successTemplate,
        error: this.errorTemplate
      }
    )).subscribe(
      (res) => {
        if (res[0] === 10000) {

              
          this.toastr.show( 'No relevant information in ' + this.fileName, {
              icon: '😐', 
              duration: 10000
          });

   
          this.fileLoading = false;
        } else {
          
          this.toastr.success(this.fileName +' uploaded', {
            icon: '👏',
            duration: 10000
          });
          let newDocs = this.newDocuments ? this.newDocuments : [];

          let newData = newDocs.map((item) => 
              Object.assign({}, item, res['data'].id)
          )


          console.log('data id ', res['data'].id);
          console.log('s', newData);

          this.documentStore.update({
            newDocuments: newData,
          });
          this.getDocumentsAndSentences();
          this.changeDetector.detectChanges();
          if (this.selectedClass) {
            this.documentsService
            .getOneDocument(this.selectedClass)
            .subscribe((data) => {
              this.selectedDoc = data;
              this.loading = false;
            });
          }
          this.fileLoading = false;
        }
        // this.fileName = null;
        // this.fileToUpload = null;

        this.fileObj.splice(a, 1);
        // delete file from FileList
        this.fileArr.splice(a, 1);
      
        if(this.fileArr.length == 0){
          this.attachment.nativeElement.value ='' ;
        }

      },
      (e) => {
      
        this.toastr.error(e.error.error, {
          icon: '😐', 
          duration: 10000
        });

  
        this.fileName = null;
        this.fileToUpload = null;
        this.fileLoading = false;

        setTimeout( () => {
          location.reload();
        }, 1500)
      }
    );

    }
    this.fileUpload=false;
  
  }

  deleteDocumentFromStore(id: number): any {
    if (this.newDocuments !== null) {
      const index = this.newDocuments.indexOf(id);
      if (index > -1) {
        if (this.newDocuments.length < 2) {
          this.newDocuments = null;
        } else {
          this.newDocuments = this.newDocuments.filter((x) => {
            return x !== id;
          });
        }
        this.documentStore.update({
          newDocuments: this.newDocuments,
        });
      }
    }
  }

  removeDocModal(doc: Document, template: TemplateRef<any>): void {
    this.docToRemove = doc;
    const config = {
      animated: true,
      class: 'modal-xl modal-fixed-footer'
    };
    this.modalRef = this.modalService.show(template, config);
  }

  deleteFile(doc: Document): void {

    const docId = doc.id;
    this.modalRef.hide();
    if (this.uploadLimitToastr) {
      this.uploadLimitToastr.close();
    }
    this.documentsService.deleteOneDocument(doc).subscribe( res => {

      this.toastr.success( 'Your document has been correctly deleted', {
        icon: '😊',
        duration: 10000
      });

      if (this.selectedDoc && this.selectedDoc.id !== docId) {
        location.reload();
      } else {
        this.selectedDoc = null;
      }
      
      this.loading = true;
      this.selectedClass = null;
      this.pageNumber = null;
      this.selectedDoc = null;
      this.loading = false;
      this.filteredSentences = this.sentences;
      this.getDocumentsAndSentences();
    }, (e) => {
      this.toastr.error('Something went wrong: ' + e.error.error, {
        icon: '😐', 
        duration: 10000
      });
    })
  }

  rateEvent(buy: boolean, sell: boolean, hold: boolean){


    this.ratingFilter = {
      sell: sell,
      hold: hold,
      buy: buy
    }


    let filterToCheck = [];
    if (this.ratingFilter.sell) {
        filterToCheck.push('sell');
    }
    if (this.ratingFilter.hold) {
      filterToCheck.push('hold');
    }
    if (this.ratingFilter.buy) {
      filterToCheck.push('buy');
    }

    if (filterToCheck.length < 1){
      //filteredSentences = this.filteredSentences;
    }  else {
      this.filteredSentences = this.filteredSentences.filter(e => {
        let ratings = e.rating.split('-');
        let cleanArray = ratings.filter(function (el) {
            return el != "";
          });
          return cleanArray.some(r=> filterToCheck.includes(r))
  
      });
    }

  }
  


  countryEvent(countryValue: any) {

    if (countryValue !== null) {
      console.log('countryval', countryValue)

      this.filteredSentences = this.filteredSentences.filter((e) => {
        const companyList = e.document.companies.map((c) => {
         console.log('country', c.country);
          return c.country
        } );
        return companyList.includes(countryValue);
      });

    }
  }

  sectorEvent(sectorValue: any) {

    if (sectorValue !== null) {

      this.filteredSentences = this.sentences.filter((e) => {
        const companyList = e.document.companies.map((c) => {
         console.log('country', c.country);
          return c.sector
        } );
        return companyList.includes(sectorValue);
      });

    }
  }

  searchEvent(type: string) {
    this.changeDetector.markForCheck();
    const filteredSentences = this.filteredSentences;
    if (type == 'rating') {
        this.filteredSentences = this.rateEvent(this.filtersForm.value.buy, this.filtersForm.value.sell, this.filtersForm.value.hold)
    }
  }

  onFormChanges(): void {
    
    this.filtersForm.valueChanges.subscribe(val => {
      console.log('val', val)
      this.rateEvent(this.filtersForm.value.buy, this.filtersForm.value.sell, this.filtersForm.value.hold)
      this.countryEvent(this.filtersForm.value.country);
      this.sectorEvent(this.filtersForm.value.sector);
    })
  }

  resetFilters():void {
    this.filtersForm.reset();
    this.filteredSentences = this.sentences;
    
  }

}
