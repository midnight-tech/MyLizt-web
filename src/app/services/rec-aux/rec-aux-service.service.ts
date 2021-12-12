import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RecAuxService {

  removedContent: string[];
  addedContent: string[];

  constructor() {
    this.removedContent = []
    this.addedContent = []
  }

  addRemovedContent(id: string) {
    this.removedContent.push(id);
  }

  addAddedContent(id: string) {
    this.addedContent.push(id)
  }

  contentInRemovedContent(contentId: string) {
    return this.removedContent.includes(contentId)
  }

  contentInAddedContent(contentId: string) {
    return this.addedContent.includes(contentId)
  }

  destroy() {
    this.removedContent = []
    this.addedContent = []
  }

}
