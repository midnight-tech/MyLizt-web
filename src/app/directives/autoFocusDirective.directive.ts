import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appAutoFocusDirective]'
})
export class AutoFocusDirectiveDirective {

  constructor(private host: ElementRef) {

  }

  ngAfterViewInit(){
    this.host.nativeElement.focus()
  }

}
