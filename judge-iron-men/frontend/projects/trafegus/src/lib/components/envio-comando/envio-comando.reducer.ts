
import { ActionType, Pages } from "./envio-comando.actions";
import { Comando, Valor, EnvioComando } from '../../models/comando';
import { Veiculo } from '../../models/veiculo';

type Status = 'LOADING' | 'ERROR' | 'OK';

type StatusEnvio = Status | 'NENHUM';

interface ComandosState {
  data: { [id: string]: Comando },
  status: Status
  pesquisa: string
  indiceOrdenado: string[]
  indice: string[]
}

export interface EnvioComandoState {
  comandos: ComandosState

  envios: {
    data: EnvioComando[]
    status: Status
  }

  valores: {
    [comando: string]: {
      [parametro: string]: Valor
    }
  }

  veiculo: Veiculo,
  selecionados: string[]
  pagina: Pages
  open: boolean
  valido: boolean
  statusEnvio: StatusEnvio
}

const updateStateValido = (state: EnvioComandoState) => {
  return {
    ...state,
    valido: state.selecionados.every(selecionado =>
      state.comandos.data[selecionado].parametros.every(parametro =>
        state.valores[selecionado] && !!state.valores[selecionado][parametro.id]))
  }
}

const createComandosState = (comandos: Comando[]): ComandosState => {
  const comandoDict = comandos.reduce((acc, comando) => {
    return {
      ...acc,
      [comando.id]: comando
    }
  }, {});

  const indice = comandos
    .sort((a, b) => a.descricao.localeCompare(b.descricao))
    .map(c => c.id);

  return {
    data: comandoDict,
    pesquisa: '',
    indice: indice,
    indiceOrdenado: indice,
    status: 'OK'
  }
}

const precisaConfigurarParametros = (state: EnvioComandoState) =>
  state.selecionados.some((selecionado) => state.comandos.data[selecionado].parametros.length > 0)

const toggleItem = <T>(lista: T[], item: T): T[] => {
  if (lista.indexOf(item) > -1) {
    return lista.filter(k => k !== item);
  }
  return [...lista, item];
}

export const initialState: EnvioComandoState = {
  comandos: {
    data: {},
    status: 'LOADING',
    pesquisa: '',
    indiceOrdenado: [],
    indice: [],
  },

  envios: {
    data: [],
    status: 'LOADING',
  },

  valores: {},
  veiculo: null,

  selecionados: [],
  pagina: Pages.PageHistorico,
  valido: false,
  open: false,
  statusEnvio: 'NENHUM'
};

export function reducer(state: EnvioComandoState, message: ActionType): EnvioComandoState {
  switch (message.type) {
    case 'CANCELAR':
      return updateStateValido({
        ...state,
        pagina: Pages.PageHistorico,
        selecionados: [],
        valores: {},
      });
    case 'ENVIAR':
      return updateStateValido({
        ...state,
        statusEnvio: 'LOADING'
      });
    case 'ENVIAR_SUCESSO':
      return updateStateValido({
        ...state,
        pagina: Pages.PageHistorico,
        selecionados: [],
        valores: {},
        statusEnvio: 'OK'
      });
    case 'ENVIAR_ERRO':
      return {
        ...state,
        statusEnvio: 'ERROR'
      };
    case 'SET_PAGE':
      // Pular a configuração de parâmetro se não tem parâmetro
      if (message.page == Pages.PageConfigurarParametro
        && !precisaConfigurarParametros(state)) {

        return {
          ...state,
          pagina: state.pagina == Pages.PageConfirmar ?
            Pages.PageSelecionarEnvio :
            Pages.PageConfirmar,
          statusEnvio: 'NENHUM',
        }
      }

      return {
        ...state,
        statusEnvio: 'NENHUM',
        pagina: message.page
      };
    case 'TOGGLE':
      return updateStateValido({
        ...state,
        pagina: Pages.PageHistorico,
        open: !state.open,
        selecionados: [],
        valores: {},
        comandos: {
          ...state.comandos,
          pesquisa: '',
        }
      });
    case 'SET_VEICULO':
      return {
        ...initialState,
        veiculo: message.veiculo,
        open: state.open,
        pagina: state.pagina == Pages.PageConfirmar || state.pagina == Pages.PageConfigurarParametro ?
          Pages.PageSelecionarEnvio : 
          state.pagina
      }
    case 'REQUEST_COMANDOS':
      return updateStateValido({
        ...state,
        comandos: initialState.comandos,
        valores: {},
        selecionados: []
      });
    case 'REQUEST_COMANDOS_ERROR':
      return {
        ...state,
        comandos: {
          ...initialState.comandos,
          status: 'ERROR'
        }
      }
    case 'REQUEST_COMANDOS_SUCCESS':
      return {
        ...state,
        comandos: createComandosState(message.comandos),
      }
    case 'REQUEST_ENVIOS':
      return {
        ...state,
        envios: initialState.envios
      }
    case 'REQUEST_ENVIOS_ERROR':
      return {
        ...state,
        envios: {
          ...initialState.envios,
          status: 'ERROR'
        }
      }
    case 'REQUEST_ENVIOS_SUCCESS':
      return {
        ...state,
        envios: {
          status: 'OK',
          data: message.envios
        }
      }
    case 'SELECIONAR_COMANDO':
      return updateStateValido({
        ...state,
        selecionados: toggleItem(state.selecionados, message.comando),
        comandos: {
          ...state.comandos,
          pesquisa: '',
          indice: state.comandos.indiceOrdenado
        },
      });
    case 'PESQUISA':
      return {
        ...state,
        comandos: {
          ...state.comandos,
          pesquisa: message.pesquisa,
          indice: state.comandos.indiceOrdenado
            .map(k => state.comandos.data[k])
            .filter(k => {
              return message.pesquisa === ''
                || k.descricao.toLocaleLowerCase().indexOf(message.pesquisa.toLocaleLowerCase()) > -1
            })
            .map(c => c.id)
        }
      };
    case 'SELECIONAR_VALOR': {
      const valor = message.parametro.valores.find(
        k => k.id.toString() == message.id);

      return updateStateValido({
        ...state,
        valores: {
          ...state.valores,
          [message.comando.id]: {
            ...state.valores[message.comando.id],
            [message.parametro.id]: valor
          }
        },
      });
    }
  }
  return state;
}