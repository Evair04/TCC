import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'fab',
  templateUrl: './fab.component.html',
  styleUrls: ['./fab.component.sass']
})
export class FabComponent {
  @Input() showing: boolean = false
  @Input() open: boolean = false
  @Input() disabled: boolean = false
  @Output() iconClicked: EventEmitter<MouseEvent> = new EventEmitter();

  onIconClicked(e: MouseEvent) {
    this.iconClicked.emit(e);
  }
}
