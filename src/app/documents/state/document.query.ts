import { Query } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { DocumentState, DocumentStore } from './document.store';

@Injectable({ providedIn: 'root' })
export class DocumentQuery extends Query<DocumentState> {
  // isFavorite$ = this.select(state => !!state.newChannels);

  getNewChannels(): number[] {
    return this.getValue().newChannels;
  }

  getNewDocuments(): number[] {
    return this.getValue().newDocuments;
  }

  getFavorites(): string[] {
    return this.getValue().keys;
  }

  constructor(protected store: DocumentStore) {
    super(store);
  }
}
