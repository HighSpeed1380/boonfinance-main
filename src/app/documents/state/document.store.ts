import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

export interface DocumentState {
  newChannels: number[];
  newDocuments: number[];
  keys: string[];
}

export function createInitialState(): DocumentState {
  return {
    newChannels: null,
    newDocuments: null,
    keys: null
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'document', resettable: true })
export class DocumentStore extends Store<DocumentState> {

  constructor() {
    super(createInitialState());
  }
}
