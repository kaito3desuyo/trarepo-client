import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EditStationComponent } from './edit-station/edit-station.component';
import {FormsModule} from '@angular/forms';
import { EditStopComponent } from './edit-station/edit-stop/edit-stop.component';
import { EditRouteComponent } from './edit-route/edit-route.component';
import { RoutemapComponent } from './routemap/routemap.component';
import {MatTabsModule} from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
@NgModule({
  declarations: [
    AppComponent,
    EditStationComponent,
    EditStopComponent,
    EditRouteComponent,
    RoutemapComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
      MatTabsModule,
      BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
