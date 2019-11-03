import { Component, OnInit, Input } from '@angular/core';
import { StationService } from './station.service';
import {Station} from '../../lib/JPTI/Station';
declare function f_busmap(value:any):any;
declare function getPos():any;
declare const window: any;
declare const setStopCallback: any;
@Component({
  selector: 'app-edit-station',
  templateUrl: './edit-station.component.html',
  styleUrls: ['./edit-station.component.scss']
})
export class EditStationComponent implements OnInit {

  /**
   * A station that is edited now.
   * When this is changed, current station info is saved and editor view is updated.
   */
  private station:Station=null;

  constructor(private stationService:StationService) { }

  ngOnInit() {
    this.stationService.getStation().subscribe(station=>this.station=station);
    f_busmap({"cors_url": "", "rt": false, "data": "https://kamelong.com/nodeJS/api?minLat=34&maxLat=36&minLon=135&maxLon=136&zoomLevel=10", "data_type": "api", "div_id": "div1", "global": true, "change": false, "leaflet": true, "clickable": true, "timetable": false, "direction": false, "parent_route_id": "route_long_name", "stop_name": true, "stop_name_overlap": true, "zoom_level": 14, "svg_zoom_ratio": 2, "background_map": true, "background_layers": [["https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png", {attribution: "<a href=\"https://maps.gsi.go.jp/development/ichiran.html\">地理院タイル</a>", opacity: 0.25}]], "font_size": 16, "font_family": "'源ノ角ゴシック'", "stop_color_standard": "#FFFFFF", "stop_color_nonstandard": "#FFFF00", "stop_color_location": "#c0c0c0", "stop_stroke_color": "#808080", "stop_stroke_with": 1, "show_stop_location": false, "stop_direction": false, "min_space_width": 2, "min_width": 4, "round": false});
    window.openStation=function (id:string) {
      console.log(id)
    };
    setStopCallback((station_id:string)=> {
      this.stationService.setNowStation(station_id);
    });
  }

  /**
   * add new stop to this.station
   */
  addNewStop(){
    this.station.addNewStop();
  }
  makeNewStation(){
    var pos=getPos() as Array<string>;
    console.log(pos);
    this.stationService.makeNewStation(parseFloat(pos[0]),parseFloat(pos[1]));
    var menu=document.getElementById('mapMenu');
    menu.style.display="none";


  }
  selectStation(id:string){
    console.log(id);

  }

}
