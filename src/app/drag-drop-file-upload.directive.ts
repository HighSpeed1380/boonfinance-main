import { Directive, EventEmitter, Output, HostListener, HostBinding }  from '@angular/core';


@Directive({
  selector: '[appDragDropFileUpload]'
})
export class DragDropFileUploadDirective {
  @Output() fileDropped = new EventEmitter<any>();

  @HostBinding('style.background-color') private background = '#ffffff';

  // Dragover Event
  @HostListener('dragover', ['$event']) dragOver(event:any) {
    event.preventDefault();
    event.stopPropagation();
    this.background = '#e2eefd';
  }

  // Dragleave Event
  @HostListener('dragleave', ['$event']) public dragLeave(event:any) {
    event.preventDefault();
    event.stopPropagation();
    this.background = '#ffffff'
  }

  // Drop Event
  @HostListener('drop', ['$event']) public drop(event:any) {
    event.preventDefault();
    event.stopPropagation();
    this.background = '#ffffff';
    console.log(event.dataTransfer.files)
    let files:any;
    for(let a =0;a<event.dataTransfer.files.length;a++){
    if(  event.dataTransfer.files[a].type != 'application/pdf'){
      console.log('File with incorrect format')
      return;
    }

    else{
      files = event.dataTransfer.files;
    }
    }
    
    console.log(files);
    if (files.length > 0) {
      this.fileDropped.emit(files)
    }
  }

}
