import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { TrafegusModule } from 'projects/trafegus/src/public-api';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    TrafegusModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
