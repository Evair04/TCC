
import { Component } from '@angular/core';
import { GridsterConfig, GridsterItem } from 'angular-gridster2';
import { HttpClient } from '@angular/common/http';
import { pluck, shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent {
  private items: Array<GridsterItem> = [
    {cols: 3, rows: 3, x: 1, y: 0, selectedItem: 0, children: [{type: 'GRID'}]},
    {cols: 1, rows: 1, x: 0, y: 0, selectedItem: 0, children: [{type: 'BORGES'}]},
    {cols: 1, rows: 1, x: 0, y: 1, selectedItem: 0, children: [{type: 'BORGES'}]},
    {cols: 1, rows: 1, x: 0, y: 2, selectedItem: 0, children: [{type: 'BORGES'}]},
  ];

  private options: GridsterConfig = {
    draggable: {
      enabled: false,
      dropOverItems: true,
      dropOverItemsCallback: this.onDropOverItems.bind(this),
      ignoreContentClass: 'abas_item',  
    },
    enableEmptyCellDrop: true,
    emptyCellDropCallback: this.onDropItem.bind(this),
    swap: false,
    pushItems: false,      
  };

  estacoes$: Observable<any>
  estacoes: number[] = [];
  
  constructor(http: HttpClient) {
    this.estacoes$ = http.get('http://localhost/ws_rest/public/api/monitorgr/estacoes')
            .pipe(pluck('estacoes'), shareReplay(1))
  }

  onEstacaoChange() {
    console.log(this.estacoes);
  }

  onDropOverItems(sourceItem, targetItem, grid) {
    const indexSource = this.items.indexOf(sourceItem);
    const indexTarget = this.items.indexOf(targetItem);

    if (indexSource < 0 || indexTarget < 0) {
      return;
    }

    this.items[indexTarget].children =
      this.items[indexTarget].children.concat(sourceItem.children);

    this.items.splice(indexSource, 1);

    // as chamadas abaixo corrigem um bug quando o usuário
    // larga um painel por cima do outro mas o preview continua
    grid.movingItem = null;
    grid.previewStyle();
  }

  onDropItem(event: DragEvent, item: GridsterItem) {
    item.dragEnabled = true;
    item.resizeEnabled = true;
    item.selectedItem = 0;
    item.children = [{type: event.dataTransfer.getData('x-application/type')}];
    this.items.push(item);
  }

  dragStartItem(e: DragEvent, type: string) {
    e.dataTransfer.setData('x-application/type', type);
  }

  onDragEnd(e: DragEvent, item, i: number) {
    if (e.dataTransfer.dropEffect !== 'move') {
      return;
    }
    item.children.splice(i, 1);
  }
}
