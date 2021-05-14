import { Component, ElementRef, Input, ViewChild, HostListener } from '@angular/core';
import { Observable, merge, Subject, of, Subscription } from 'rxjs';
import { flatMap, skip, map, catchError, takeUntil, filter, withLatestFrom } from 'rxjs/operators';
import { reducer, EnvioComandoState, initialState } from './envio-comando.reducer';
import { ComandosService } from '../../services/comandos.service';
import * as Actions from './envio-comando.actions';
import { Comando } from '../../models/comando';
import { Veiculo } from '../../models/veiculo';
import { HistoricoComandoService } from '../../services/historico-comando.service';
import { EnvioComandoService } from '../../services/envio-comando.service';
import { Envio } from '../../models/enviar-comando';

@Component({
  selector: 'envio-comando',
  templateUrl: './envio-comando.component.html',
  styleUrls: ['./envio-comando.component.sass'],
})
export class EnvioComandoComponent {

  @Input() veiculo$: Observable<Veiculo>;
  @ViewChild("pesquisa", {static: false}) pesquisaElement: ElementRef;

  @HostListener('document:keydown', ['$event'])
  onKeyDown(e) {
    console.log(e);
    // if (e.target != document.body) {
    //   return;
    // }
    // this.dispatch$.next(Actions.setPage(Actions.Pages.PageSelecionarEnvio));
  }

  dispatch$: Subject<Actions.ActionType> = new Subject();
  state$: Observable<EnvioComandoState>;
  subscription: Subscription;

  constructor(private comandosService: ComandosService,
              private historicoService: HistoricoComandoService,
              private envioService: EnvioComandoService) {
  }
  
  ngOnInit() {        
    this.state$ = Actions.createStore(this.dispatch$, reducer, initialState);    
    const epic$ = this.dispatch$.pipe(withLatestFrom(this.state$));

    this.subscription = merge(
      epic$.pipe(
        filter(([action, state]) => action.type == 'REQUEST_ENVIOS'),
        flatMap(([_, state]) =>       
          this.historicoService.getHistorico(state.veiculo.terminal)
            .pipe(
              takeUntil(this.veiculo$.pipe(skip(1))),
              map(k => Actions.requestEnviosSuccess(k.envios)),
              catchError(e => of(Actions.requestEnviosError()))
            ),
        )
      ),
      epic$.pipe(
        filter(([action, state]) => action.type == 'REQUEST_COMANDOS'),
        flatMap(([_, state]) => 
          this.comandosService.getComandos(state.veiculo.terminal)
            .pipe(
              takeUntil(this.veiculo$.pipe(skip(1))),
              map(k => Actions.requestComandoSuccess(k.comandos)),
              catchError(e => of(Actions.requestComandoError()))
            ),
        )
      ),
      epic$.pipe(
        filter(([action, state]) => (action.type == 'TOGGLE' && state.open) || action.type == 'ENVIAR_SUCESSO'),
        map(() => Actions.requestEnvios())
      ),
      epic$.pipe(
        filter(([action, _]) => action.type == 'SET_VEICULO'),
        flatMap(() => merge(
          of(Actions.requestComando()), 
          of(Actions.requestEnvios())
        ))
      ),
      epic$.pipe(
        filter(([action]) => action.type == 'ENVIAR'),
        flatMap(([_, state]) => {
          const comandos: Envio[] = state.selecionados.map(selecionado => ({
            terminal: state.veiculo.terminal,
            comando: state.comandos.data[selecionado].id,
            parametros: state.comandos.data[selecionado].parametros.map(parametro => ({
              valorParametro: state.valores[selecionado][parametro.id].id
            }))
          }));

          return this.envioService
            .enviar(comandos)
            .pipe(
              map(() => Actions.enviarSucesso()),
              catchError(e => of(Actions.enviarErro()))
            )
        })
      ),
      this.veiculo$.pipe(
        flatMap(veiculo => merge(
          of(Actions.setVeiculo(veiculo)),
        ))
      )
    )
    .subscribe(this.dispatch$);
    
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  toggle() {
    this.dispatch$.next(Actions.toggle())
  }

  selecionar(comando: Comando) {    
    this.dispatch$.next(Actions.selecionarComando(comando.id));
    this.focarPesquisa();    
  }

  onPesquisaChange(e: any) {    
    this.dispatch$.next(Actions.pesquisar(e.target.value));
  }

  // Colocar o foco na barra de pesquisa
  focarPesquisa() {    
    if (this.pesquisaElement && this.pesquisaElement.nativeElement) {
      this.pesquisaElement.nativeElement.focus();
    }
  }

  selectValor(comando, parametro, id) {
    this.dispatch$.next(Actions.selecionarValor(comando, parametro, id));
  }

  gotoHistorico() {
    this.dispatch$.next(Actions.setPage(Actions.Pages.PageHistorico))
  }

  gotoSelecionarEnvio() {
    this.dispatch$.next(Actions.setPage(Actions.Pages.PageSelecionarEnvio))
    setTimeout(() => {
      this.focarPesquisa();
    }, 550);
  }

  gotoConfigurarParametro() {
    this.dispatch$.next(Actions.setPage(Actions.Pages.PageConfigurarParametro))
  }

  gotoConfirmar() {
    this.dispatch$.next(Actions.setPage(Actions.Pages.PageConfirmar))
  }

  cancelar() {
    this.dispatch$.next(Actions.cancelar())
  }

  enviar() {
    this.dispatch$.next(Actions.enviar());    
  }

  isErro(status) {
    return ['CA', 'ET', 'EV'].indexOf(status) > -1;
  }

  isSucesso(status) {
    return status == 'TV';
  }

  getDescricaoStatus(status) {
    switch(status) {
      case 'CA': return 'FALHA';
      case 'ET': return 'FALHA';
      case 'EV': return 'FALHA';
      case 'PE': return 'PENDENTE';
      case 'TT': return 'PENDENTE';
      case 'TV': return 'SUCESSO';
    }
  }

  atualizarHistorico() {
    this.dispatch$.next(Actions.requestEnvios());
  }

  atualizarComandos() {
    this.dispatch$.next(Actions.requestComando());
  }
}
