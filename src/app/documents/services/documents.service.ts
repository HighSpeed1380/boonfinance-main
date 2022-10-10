import { HttpClient, HttpHeaderResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';



export interface SentenceModel {
  content: any;
  pageNumber: any;
  rating: any;
  sentiment: any;
  id: number;
  text: string;
  page: number;
  offset: number;
  mention?: boolean;
  documentId: number;
}

export interface Document {
  companies: Company[];
  key: any;
  id: number;
  filename: string;
  title: string;
  author: string;
  provider: string;
  createdAt: string;
  companyName: string[];
  companyQuote: string[];
  relevance: number;
  link: string;
  sentences: SentenceModel[];
  processed: boolean;
}

export interface Company {
  id:number;
  company: string;
  keyword: string;
  country: string;
  sector: string;
  region: string;
  quoteBloomberg: string[];
  quoteReuters: string[];

}

@Injectable({
  providedIn: 'root'
})
export class DocumentsService {

  apiUrl = environment.coreApi;

  constructor(
    private http: HttpClient) { }


    getDocuments(): Observable<Document[]> {
      return this.http.get<any>(this.apiUrl + 'documents').pipe(map(el => {
        return el.data;
      }));
    }

    getSentences(): Observable<SentenceModel[]> {
      return this.http.get<any>(this.apiUrl + 'sentences').pipe(map(el => {
        return el.data;
      }));
    }

    getOneDocument(id: number): Observable<Document> {
      return this.http.get<any>(this.apiUrl + 'document/' + id).pipe(map(el => {
        return el.data;
      }));
    }

    deleteOneDocument(doc: Document): Observable<Document> {
      return this.http.delete<any>(this.apiUrl + 'delete/document/' + doc.id);
    }

    upload(filelist:any): Observable<any[]> {
      console.log(filelist.name)
      const formData = new FormData();
      let file = filelist;
      console.log(file.name)
      formData.append('file', file);
      formData.append('filename', file.name);

      console.log('formData', file);
      let headers = new HttpHeaders()
      headers.append('Content-Type', 'multipart/form-data');
      return this.http.post<any>(this.apiUrl + 'upload', formData, {headers: headers});                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
    }

}
