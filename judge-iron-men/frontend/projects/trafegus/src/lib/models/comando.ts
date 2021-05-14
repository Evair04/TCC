
export interface Valor {
    id: number
    sequencia: number
    descricao: string
    valor: string
}

export interface Parametro {
    id: number
    sequencia: number
    descricao: string
    valores: Valor[]
}

export interface Comando {
    descricao: string
    id: string
    parametros: Parametro[]
}

export interface EnvioComando {
    id: string
    comando: string
    descricao: string
    status: string
    dataCadastro: string
}