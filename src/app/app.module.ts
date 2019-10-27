import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EditStationComponent } from './edit-station/edit-station.component';
import {FormsModule} from '@angular/forms';
import { EditStopComponent } from './edit-station/edit-stop/edit-stop.component';
import { EditRouteComponent } from './edit-route/edit-route.component';

@NgModule({
  declarations: [
    AppComponent,
    EditStationComponent,
    EditStopComponent,
    EditRouteComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
