
import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Envio } from "../models/enviar-comando";
import { SessionService } from './session.service';
import { flatMap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class EnvioComandoService {
    constructor(private http: HttpClient, private session: SessionService) {

    }

    enviar(envios: Envio[]) {
        const url = 'http://localhost/ws_rest/public/api/enviocomando';
        const data = {
            envios,
        };

        return this.session.getSession()
            .pipe(
                flatMap(session => 
                    this.http.post(url, data, { headers: {'Authorization': 'Basic ' + session.token} }))
            );
    }
}