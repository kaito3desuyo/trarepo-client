import { Component, OnInit } from '@angular/core';
import {RouteMAP} from "./busmap";
import RouteMapMain = RouteMAP.RouteMapMain;

@Component({
  selector: 'app-routemap',
  templateUrl: './routemap.component.html',
  styleUrls: ['./routemap.component.scss']
})
export class RoutemapComponent implements OnInit {


  constructor() { }

  ngOnInit() {
    const routeMap=new RouteMapMain("div_leaflet");
    routeMap.f_busmap();
  }

}
