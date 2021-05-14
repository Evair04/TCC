import { Component, Input, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'swipe',
  templateUrl: './swipe.component.html',
  styleUrls: ['./swipe.component.sass']
})
export class SwipeComponent {

  @ViewChild('content', {static: false}) content: ElementRef;

  @Input() width: number = 380
  @Input() 
  set page(val: number) {
    if (this.content) {
      for(var i = 0; i < this.content.nativeElement.children.length; i++) {
        const c = this.content.nativeElement.children[i];
        c.classList.add('swipe-hide');        
        if (i == val) {
          c.classList.remove('swipe-hide');
        }
      }
    }
    
    this._page = val;
  }

  _page: number = 0
}