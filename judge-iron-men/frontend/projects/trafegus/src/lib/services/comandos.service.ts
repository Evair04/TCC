
import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Comando } from '../models/comando';
import { SessionService } from './session.service';
import { flatMap } from 'rxjs/operators';

export interface ComandoResponse {
    comandos: Comando[],
}

@Injectable({
    providedIn: 'root',
})
export class ComandosService {
    constructor(private http: HttpClient, private session: SessionService) {
    }

    getComandos(terminal: string) {
        const url = `http://localhost/ws_rest/public/api/terminal/${terminal}/comandos`;

        return this.session.getSession()
            .pipe(
                flatMap(session => 
                    this.http.get<ComandoResponse>(url, { headers: {'Authorization': 'Basic ' + session.token} }))
            );
    }
}