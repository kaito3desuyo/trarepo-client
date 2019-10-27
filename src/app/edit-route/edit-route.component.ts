import { Component, OnInit } from '@angular/core';
import {Station} from '../../lib/Station';
import {Route} from '../../lib/Route';
import {RouteService} from './route.service';
declare function f_busmap(value:any):any;

@Component({
  selector: 'app-edit-route',
  templateUrl: './edit-route.component.html',
  styleUrls: ['./edit-route.component.scss']
})
export class EditRouteComponent implements OnInit {
  private route:Route=null;

  private stationData:Array<StationData>=[];

  constructor(private routeService:RouteService) { }

  ngOnInit() {
    this.routeService.getRoute().subscribe(route=>{
      this.route=route;
      this.init();
    });
    f_busmap({"cors_url": "", "rt": false, "data": "https://kamelong.com/nodeJS/api?minLat=34&maxLat=36&minLon=135&maxLon=136&zoomLevel=10", "data_type": "api", "div_id": "div1", "global": true, "change": false, "leaflet": true, "clickable": true, "timetable": false, "direction": false, "parent_route_id": "route_long_name", "stop_name": true, "stop_name_overlap": true, "zoom_level": 14, "svg_zoom_ratio": 2, "background_map": true, "background_layers": [["https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png", {attribution: "<a href=\"https://maps.gsi.go.jp/development/ichiran.html\">地理院タイル</a>", opacity: 0.25}]], "font_size": 16, "font_family": "'源ノ角ゴシック'", "stop_color_standard": "#FFFFFF", "stop_color_nonstandard": "#FFFF00", "stop_color_location": "#c0c0c0", "stop_stroke_color": "#808080", "stop_stroke_with": 1, "show_stop_location": false, "stop_direction": false, "min_space_width": 2, "min_width": 4, "round": false});
  }

  public init(){

  }

}
class StationData{
  public y1=0;
  public y2=0;
  public station:Station=new Station();

}
