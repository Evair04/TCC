
import { Comando, Parametro, EnvioComando } from "../../models/comando";
import { Observable } from 'rxjs';
import { scan, tap, shareReplay } from 'rxjs/operators';
import { Veiculo } from '../../models/veiculo';

export enum Pages {
    PageHistorico = 0,
    PageSelecionarEnvio = 1,
    PageConfigurarParametro = 2,
    PageConfirmar = 3,
};

type ActionVeiculo = { 
    type: 'SET_VEICULO',
    veiculo: Veiculo
};

type ActionRequestComandos = { type: 'REQUEST_COMANDOS' };
type ActionRequestComandosError = { type: 'REQUEST_COMANDOS_ERROR' };
type ActionRequestComandosSuccess = { type: 'REQUEST_COMANDOS_SUCCESS', comandos: Comando[]};

type ActionRequestEnvios = { type: 'REQUEST_ENVIOS' };
type ActionRequestEnviosError = { type: 'REQUEST_ENVIOS_ERROR' };
type ActionRequestEnviosSuccess = { type: 'REQUEST_ENVIOS_SUCCESS', envios: EnvioComando[]};

type ActionSelecionar = { type: 'SELECIONAR_COMANDO', comando: string };
type ActionPesquisa = { type: 'PESQUISA', pesquisa: string };

type ActionSetPage = { type: 'SET_PAGE', page: Pages };
type ActionToggle = { type: 'TOGGLE' };

type ActionCancelar = { type: 'CANCELAR' };

type ActionEnviar = { type: 'ENVIAR' };
type ActionEnviarSucesso = { type: 'ENVIAR_SUCESSO' };
type ActionEnviarErro = { type: 'ENVIAR_ERRO' };

export type ActionSelecionarValor = {
    type: 'SELECIONAR_VALOR',
    comando: Comando,
    parametro: Parametro,
    id: string
};


export type ActionType =
    ActionVeiculo
    | ActionRequestComandos
    | ActionRequestComandosError
    | ActionRequestComandosSuccess
    | ActionRequestEnvios
    | ActionRequestEnviosError
    | ActionRequestEnviosSuccess
    | ActionSelecionar
    | ActionPesquisa
    | ActionSelecionarValor
    | ActionToggle
    | ActionSetPage
    | ActionCancelar
    | ActionEnviar
    | ActionEnviarSucesso
    | ActionEnviarErro;

export type Data =
    {comandos: Comando[], envios: EnvioComando[], veiculo: Veiculo};

export const createStore = <T, K>(actions$: Observable<T>, reducer: (state: K, action: T) => K, initial: K): Observable<K> =>
    actions$
    .pipe(
        tap(console.log),
        scan<T, K>(reducer, initial),   
        tap(console.log),
        shareReplay(1)
    );
    
export const selecionarValor = (comando: Comando, parametro: Parametro, id: string ): ActionSelecionarValor =>
    ({ type: 'SELECIONAR_VALOR', comando, parametro, id })
        
export const selecionarComando = (id: string): ActionSelecionar => 
    ({ type: 'SELECIONAR_COMANDO', comando: id })

export const pesquisar = (pesquisa: string): ActionPesquisa => 
    ({ type: 'PESQUISA', pesquisa })

export const setPage = (page: Pages): ActionSetPage => 
    ({ type: 'SET_PAGE', page})

export const toggle = (): ActionToggle => 
    ({ type: 'TOGGLE' })

export const requestEnvios = (): ActionRequestEnvios => ({ type: 'REQUEST_ENVIOS' });
export const requestEnviosError = (): ActionRequestEnviosError => ({ type: 'REQUEST_ENVIOS_ERROR' });
export const requestEnviosSuccess = (envios: EnvioComando[]): ActionRequestEnviosSuccess => 
    ({ type: 'REQUEST_ENVIOS_SUCCESS', envios });

export const requestComando = (): ActionRequestComandos => ({ type: 'REQUEST_COMANDOS' });
export const requestComandoError = (): ActionRequestComandosError => ({ type: 'REQUEST_COMANDOS_ERROR' });
export const requestComandoSuccess = (comandos: Comando[]): ActionRequestComandosSuccess => 
    ({ type: 'REQUEST_COMANDOS_SUCCESS', comandos });

export const setVeiculo = (veiculo: Veiculo): ActionVeiculo => ({ 
    type: 'SET_VEICULO',
    veiculo
})

export const cancelar = (): ActionCancelar => 
    ({ type: 'CANCELAR' })

export const enviar = (): ActionEnviar => 
    ({ type: 'ENVIAR' })
    
export const enviarSucesso = (): ActionEnviarSucesso => 
    ({ type: 'ENVIAR_SUCESSO' })

export const enviarErro = (): ActionEnviarErro => 
    ({ type: 'ENVIAR_ERRO' })