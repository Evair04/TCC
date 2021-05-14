
import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { EnvioComando } from '../models/comando';
import { SessionService } from './session.service';
import { flatMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface HistoricoResponse {
    envios: EnvioComando[]
}

@Injectable({
    providedIn: 'root',
})
export class HistoricoComandoService {
    constructor(private http: HttpClient, private session: SessionService) {
    }

    getHistorico(terminal: string) : Observable<HistoricoResponse> {
        const url = `http://localhost/ws_rest/public/api/terminal/${terminal}/enviocomando`;
        return this.session.getSession()
            .pipe(
                flatMap(session => 
                    this.http.get<HistoricoResponse>(url, {headers: {'Authorization': 'Basic ' + session.token}}))
            )
    }
}