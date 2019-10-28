import { Component, OnInit } from '@angular/core';
import {Station} from '../../lib/Station';
import {Route} from '../../lib/Route';
import {RouteService} from './route.service';
import {init} from "protractor/built/launcher";
declare function f_busmap(value:any):any;
declare function setStopCallback(value:any):any;
@Component({
  selector: 'app-edit-route',
  templateUrl: './edit-route.component.html',
  styleUrls: ['./edit-route.component.scss']
})
export class EditRouteComponent implements OnInit {
  private route:Route=null;
  private stationData:Array<StationData>=[];

  private showInsertStation=false;
  private posInsertStation=0;
  private enableRailMapMouse=true;

  constructor(private routeService:RouteService) { }

  ngOnInit() {
    this.routeService.getRoute().subscribe(route=>{
      this.route=route;
      this.init();
    });
    f_busmap({"cors_url": "", "rt": false, "data": "https://kamelong.com/nodeJS/api?minLat=34&maxLat=36&minLon=135&maxLon=136&zoomLevel=10", "data_type": "api", "div_id": "div1", "global": true, "change": false, "leaflet": true, "clickable": true, "timetable": false, "direction": false, "parent_route_id": "route_long_name", "stop_name": true, "stop_name_overlap": true, "zoom_level": 14, "svg_zoom_ratio": 2, "background_map": true, "background_layers": [["https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png", {attribution: "<a href=\"https://maps.gsi.go.jp/development/ichiran.html\">地理院タイル</a>", opacity: 0.25}]], "font_size": 16, "font_family": "'源ノ角ゴシック'", "stop_color_standard": "#FFFFFF", "stop_color_nonstandard": "#FFFF00", "stop_color_location": "#c0c0c0", "stop_stroke_color": "#808080", "stop_stroke_with": 1, "show_stop_location": false, "stop_direction": false, "min_space_width": 2, "min_width": 4, "round": false});
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
    const pos=this.posInsertStation;//駅を追加する場所
    console.log(pos);
    //mapをタッチして駅が入力されるのを待つ
    //１、駅クリックのイベントコールバックを仕掛ける
    //２、railMapMouseMoveを一時停止する(クリックで再び使用可能にする。)
    this.enableRailMapMouse=false;
    setStopCallback((station_id:string)=> {
      this.enableRailMapMouse=true;
      const station=new Station();
      station.name=station_id;
      this.route.stations.splice(pos,0,station);
      this.init();
    });
  }


}
class StationData{
  public y1=0;
  public y2=0;
  public station:Station=new Station();
}
