import { Component, NgZone } from '@angular/core';
import { Subject, ReplaySubject } from 'rxjs';
import { Veiculo } from 'projects/trafegus/src/lib/models/veiculo';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {

  veiculo$: Subject<Veiculo> = new ReplaySubject(1);

  constructor(zone: NgZone) {
    const self = this;
    window['veiculo$'] = function(data) {
      zone.run(() => self.selectionarVeiculo(data));
    };
  }

  selectionarVeiculo(data) {
    this.veiculo$.next(data);
  }
}
