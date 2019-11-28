import { Component, OnInit } from '@angular/core';
import {RouteService} from './route.service';
import {StationService} from "../edit-station/station.service";

import {JPTI} from "../../lib/JPTI/JPTI";
import Route = JPTI.Route;
import RouteStation = JPTI.RouteStation;
declare function f_busmap(value:any):any;
declare function setStopCallback(value:any):any;
declare function setRouteCallback(value:any):any;
@Component({
  selector: 'app-edit-route',
  templateUrl: './edit-route.component.html',
  styleUrls: ['./edit-route.component.scss']
})
export class EditRouteComponent implements OnInit {
  public route:Route=null;
  private stationData:Array<StationData>=[];

  private showInsertStation=false;
  private posInsertStation=0;
  private enableRailMapMouse=true;

  constructor(private routeService:RouteService,private stationService:StationService) { }

  ngOnInit() {
    this.routeService.getRoute().subscribe(route=>{
      this.route=route;
      console.log(this.route);
      this.init();
    });
    f_busmap({"cors_url": "", "rt": false, "data": "https://kamelong.com/nodeJS/api?minLat=35.5&maxLat=36&minLon=135&maxLon=136&zoomLevel=10", "data_type": "api", "div_id": "div1", "global": true, "change": false, "leaflet": true, "clickable": true, "timetable": false, "direction": false, "parent_route_id": "route_long_name", "stop_name": true, "stop_name_overlap": true, "zoom_level": 14, "svg_zoom_ratio": 2, "background_map": true, "background_layers": [["https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png", {attribution: "<a href=\"https://maps.gsi.go.jp/development/ichiran.html\">地理院タイル</a>", opacity: 0.25}]], "font_size": 16, "font_family": "'源ノ角ゴシック'", "stop_color_standard": "#FFFFFF", "stop_color_nonstandard": "#FFFF00", "stop_color_location": "#c0c0c0", "stop_stroke_color": "#808080", "stop_stroke_with": 1, "show_stop_location": false, "stop_direction": false, "min_space_width": 2, "min_width": 4, "round": false});
    setRouteCallback((routeName)=>{
      this.routeService.setRouteByName(routeName);
    })
  }
  public routeIsNull():boolean{
    return this.route==null;
  }

  public init(){
    this.stationData=[];
    for(let i=0;i<this.route.stations.length;i++){
      const station=new StationData();
      station.station=this.route.stations[i];
      station.y1=40+56*i;
      station.y2=96+56*i;
      this.stationData.push(station);
    }
  }
  private railmapMouseMove(event:MouseEvent){
    if(this.enableRailMapMouse){
    const y=event.offsetY-40;
    if(this.stationData.length==0){
      this.posInsertStation=0;
      this.showInsertStation=true;
      return;
    }
    if(y>=0&&y<(this.stationData.length)*56){
      this.posInsertStation=Math.floor(y/56)+1;
      if(y%56>14&&y%56<42){
        this.showInsertStation=true;
      }else{
        this.showInsertStation=false;
      }
    }
    }
  }

  /**
   *　駅追加パーツの位置
   */
  private transformY():string{
    return "translate(0,"+(this.posInsertStation*56+14)+")";
  }

  /**
   * 路線に駅を追加する
   */
  private addStation(){
    //mapをタッチして駅が入力されるのを待つ
    //１、駅クリックのイベントコールバックを仕掛ける
    //２、railMapMouseMoveを一時停止する(クリックで再び使用可能にする。)
    this.enableRailMapMouse=false;
    setStopCallback((station_id:string)=> {
      this.enableRailMapMouse=true;
      var req = new XMLHttpRequest();
      req.onreadystatechange = () =>{
        if(req.readyState == 4 && req.status == 200){
          const responce=JSON.parse(req.response);
          const station=new RouteStation();
          station.station.loadFromJSON(responce);
          this.route.stations.splice(this.posInsertStation,0,station);
          this.posInsertStation++;
          this.init();

        }
      };
      req.open("GET", "https://kamelong.com/nodeJS/api/station?stationID="+station_id, false);
      req.send(null);
    });
  }

  /**
   * 路線から駅を削除する
   */
  private deleteStation(station:RouteStation){
    const index=this.route.stations.indexOf(station);
    if(index>this.posInsertStation){
      this.posInsertStation--;
    }
    this.route.stations.splice(index,1);
    this.init();
  }

  /**
   * 路線を削除する
   */
  private deleteRoute(){
    this.routeService.deleteRoute();
  }
  private makeNewRoute(){
    this.routeService.makeNewRoute();
  }


}
class StationData{
  public y1=0;
  public y2=0;
  public station:RouteStation=new RouteStation();
}
