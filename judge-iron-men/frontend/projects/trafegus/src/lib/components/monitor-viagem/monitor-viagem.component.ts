
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';

@Component({
    selector: 'monitor-viagem',
    templateUrl: './monitor-viagem.component.html',
    styleUrls: ['./monitor-viagem.component.sass'],
})
export class MonitorViagemComponent {
    columnDefs = [
        {headerName: 'Cod. terminal', field: 'term_codigo' },
        {headerName: 'Identificador', field: 'identificador' },
        {headerName: 'Transportador', field: 'transportador'},
        {headerName: 'Status', field: 'status'}, //checkbox
        {headerName: 'Cód. Empresa Escolta', field: 'sees_eesc_oras_pess_pesj_codigo'},
        {headerName: 'Empresa de Escolta', field: 'empescolta'},
        {headerName: 'Cod. Viagem', field: 'viag_codigo'},
        {headerName: 'Terminal', field: 'term_numero_terminal'},
        {headerName: 'Data Comp. Bordo', field: 'upos_data_comp_bordo'},
        {headerName: 'Data Cadastro', field: 'upos_data_cadastro'},
        {headerName: 'Ignição', field: 'ignicao'}, // 0 - Desligada, 1 - Ligada, 2 - Desconhecida
        {headerName: 'Proximidades', field: 'upos_descricao_sistema'},
        {headerName: 'Observação', field: 'observacao'},
        {headerName: 'Proprietário', field: 'proprietario'},
        {headerName: 'Tipo Comunicação', field: 'tcom_descricao'},
        {headerName: 'Código Transportador', field: 'viag_tran_pess_oras_codigo'},
        {headerName: 'Tempo Médio de Posicionamento', field: 'term_tempo_medio_posicionamento'},
        {headerName: 'Tecnologia', field: 'tecn_descricao'},
        {headerName: 'Destino', field: 'destino'},
        {headerName: 'UF de Destino', field: 'ufdes'},
        {headerName: 'Cidade de Destino', field: 'cidades'},
        {headerName: 'Frota', field: 'transfrota'},
        {headerName: 'Embarcador', field: 'embarcador'},
        {headerName: 'Cód. da Gr', field: 'codgr'},
        {headerName: 'Cnpj GR', field: 'cnpjgr'},
        {headerName: 'Gerenciadora de Risco', field: 'descgr'},
        {headerName: 'Origem', field: 'origem'},
        {headerName: 'UF de Origem', field: 'ufori'},
        {headerName: 'Cidade de Origem', field: 'cidaori'},
        {headerName: 'Cód. Embarcador', field: 'viag_emba_pjur_pess_oras_codigo'},
        {headerName: 'Cód. Veiculo', field: 'veic_oras_codigo'},
        {headerName: 'Cód. Estação', field: 'eras_codigo'},
        {headerName: 'Latitude', field: 'upos_latitude'},
        {headerName: 'Longitude', field: 'upos_longitude'},
        {headerName: 'Cód. Versão Tec.', field: 'term_vtec_codigo'},
        {headerName: 'Previsão Fim Viagem', field: 'viag_previsao_fim'},
        {headerName: 'Tipo de Comunicação', field: 'vtec_tipo_comunicacao'},
        {headerName: 'Velocidade', field: 'upos_velocidade'},
        {headerName: 'Data Tecnologia', field: 'upos_data_tecnologia'},
        {headerName: 'Código Escolta', field: 'viag_sesc_codigo'},
        {headerName: 'Código PGR', field: 'viag_pgpg_codigo'},
        {headerName: 'Tipo Operação', field: 'tope_descricao'},
        {headerName: 'Status Bloqueio', field: 'eventobloqueio'}, // 0 - Desbloqueado, 1 - Bloqueado, 3 - Desconhecido
        {headerName: 'Status Engate', field: 'eventoengate'},
        {headerName: 'Status Porta do Caroneiro', field: 'stsportacarona'}, // 0 - Fechada, 1 - Aberta, 2 - Violada, -1 - Desconhecida
        {headerName: 'Status Porta do Motorista', field: 'stsportamotora'}, // 0 - Fechada, 1 - Aberta, 2 - Violada, -1 - Desconhecida
        {headerName: 'Motorista', field: 'nomemotorista'},
        {headerName: 'Posição da Tecnologia', field: 'upos_descricao_integracao'},
        {headerName: 'Celular do Dispositivo', field: 'term_celular'},
        {headerName: 'Status Interativo do Rastreador', field: 'stsinterastreador'}, // 0 - DESCONHECIDO, 1 - MODO RASTREADO, 2 - MODO DESATIVADO, 3 - MODO EM TRANSITO, 4 - MODO EM LOCAL AUTORIZADO, 5 - MODO EM MANOBRA, 6 - MODO INTERATIVO
        {headerName: 'Última Mensagem', field: 'ultima_mensagem'},
        {headerName: 'Data Última Mensagem', field: 'ultima_mensagem_data'},
        {headerName: 'Gestor da frota', field: 'gestornome'},
        {headerName: 'Valor Merc. Específica', field: 'viag_valor_merc_especifica'},
        {headerName: 'Valor Total', field: 'viag_valor_carga'},
        {headerName: 'Em Àrea de Risco', field: 'em_area_risco'},
    ];

    data: Observable<any>;

    constructor(private http: HttpClient) {
        this.data = http.get('http://localhost/ws_rest/public/api/monitorgr/viagem')
            .pipe(pluck('data'))
    }
}
