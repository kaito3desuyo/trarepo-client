import { Component, OnInit } from '@angular/core';
import {RouteMAP} from "./busmap";
import RouteMapMain = RouteMAP.RouteMapMain;
import {RoutemapService} from "./routemap.service";
import * as L from "leaflet";

@Component({
  selector: 'app-routemap',
  templateUrl: './routemap.component.html',
  styleUrls: ['./routemap.component.scss']
})
export class RoutemapComponent implements OnInit {
  constructor(private routeMAPservice:RoutemapService) {
  }
  ngOnInit() {
    this.routeMAPservice.routeMap.f_busmap("div_leaflet")


  }
  public makeNewStation(){
    this.routeMAPservice.makeNewStation();
  }
  public onContextMenu(e:MouseEvent){
    this.routeMAPservice.prepareNewStation(e);
  }

}
