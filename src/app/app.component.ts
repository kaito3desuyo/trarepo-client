import { Component } from '@angular/core';
import {MatTabChangeEvent} from "@angular/material";
import {RouteService} from "./edit-route/route.service";
import {RoutemapService} from "./routemap/routemap.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'trarepo-client';
  constructor(private routeMapService:RoutemapService) {
  }
  //タブが切り替わった時は駅選択イベントのオンオフを切り替える。
  private onTabChange(event:MatTabChangeEvent){
    this.routeMapService.onTabChange(event);
  }
}
