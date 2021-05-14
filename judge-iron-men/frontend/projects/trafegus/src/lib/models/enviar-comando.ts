
export interface Parametro {
    valorParametro: number
}

export interface Envio {    
    terminal: string
    comando: string
    parametros: Parametro[]
}