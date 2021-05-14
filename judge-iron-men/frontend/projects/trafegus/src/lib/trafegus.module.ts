import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

import { EnvioComandoComponent } from './components/envio-comando/envio-comando.component';
import { FabComponent } from './components/fab/fab.component';
import { SwipeComponent } from './components/swipe/swipe.component';

import { ComandosService } from './services/comandos.service';
import { EnvioComandoService } from './services/envio-comando.service';
import { HistoricoComandoService } from './services/historico-comando.service';
import { SessionService } from './services/session.service';
import { MonitorViagemComponent } from './components/monitor-viagem/monitor-viagem.component';

import { AgGridModule } from 'ag-grid-angular'

@NgModule({
  declarations: [
    EnvioComandoComponent,
    FabComponent,
    SwipeComponent,
    MonitorViagemComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AgGridModule.withComponents([]),
  ],
  providers: [
    ComandosService,
    EnvioComandoService,
    HistoricoComandoService,
    SessionService,
  ],
  exports: [
    EnvioComandoComponent,
    FabComponent,
    SwipeComponent,
    MonitorViagemComponent,
  ]
})
export class TrafegusModule { }
