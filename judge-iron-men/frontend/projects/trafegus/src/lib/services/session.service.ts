import { Injectable } from "@angular/core";
import { Subject, Observable, BehaviorSubject } from 'rxjs';

export interface Session {
    token: string
}

@Injectable({
    providedIn: 'root',
})
export class SessionService {
    private session$: BehaviorSubject<Session> = new BehaviorSubject({token: btoa('suporte:chp@0479')});

    setSession(session: Session) {
        this.session$.next(session);
    }

    getSession() : Observable<Session> {
        return this.session$;
    }
}