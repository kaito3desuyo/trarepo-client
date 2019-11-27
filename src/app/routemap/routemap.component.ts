import { Component, OnInit } from '@angular/core';
import {MapRoute, RouteMap} from "./busmap";

@Component({
  selector: 'app-routemap',
  templateUrl: './routemap.component.html',
  styleUrls: ['./routemap.component.scss']
})
export class RoutemapComponent implements OnInit {


  constructor() { }

  ngOnInit() {
    const routeMap=new RouteMap("div_leaflet");
    routeMap.f_busmap();
  }

}
