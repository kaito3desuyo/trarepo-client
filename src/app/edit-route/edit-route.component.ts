import { Component, OnInit } from '@angular/core';
import {RouteService} from './route.service';
import {StationService} from "../edit-station/station.service";

import {JPTI} from "../../lib/JPTI/JPTI";
import Route = JPTI.Route;
import RouteStation = JPTI.RouteStation;
import Station = JPTI.Station;
@Component({
  selector: 'app-edit-route',
  templateUrl: './edit-route.component.html',
  styleUrls: ['./edit-route.component.scss']
})
export class EditRouteComponent implements OnInit {
  //今編集するroute
  public route:Route=null;
  //編集routeの駅データ
  private stationData:Array<StationData>=[];

  //これがtrueの時、駅追加の＋マークが出現する。
  private showInsertStation=false;

  //これがtrueの時、駅追加の＋マークはマウスに連動して動く。
  //falseの時は＋マークは固定
  private enableRailMapMouse=true;

  constructor(private routeService:RouteService,private stationService:StationService) { }

  ngOnInit() {
    this.routeService.getEditRoute().subscribe(route=>{
      this.route=route;
      this.init();
    });
  }

  //駅リスト更新
  public init(){
    this.enableRailMapMouse=true;
    this.stationData=[];
    for(let i=0; i<this.route.routeStations.length; i++){
      const station=new StationData();
      station.routeStation=this.route.routeStations[i];
      this.stationService.getStation(station.routeStation.stationID).then((s)=>{station.station=s});
      station.y1=40+56*i;
      station.y2=96+56*i;
      this.stationData.push(station);
    }
  }


  /**
   駅リスト部分でマウスが動いたときに発火する
   */
  private stationSelectorMouseMove(event:MouseEvent){
    if(this.enableRailMapMouse){
      const y=event.offsetY-40;
      if(this.stationData.length==0){
        this.routeService.posInsertStation=0;
        this.showInsertStation=true;
        return;
      }
      if(y>=0&&y<(this.stationData.length)*56){
        this.routeService.posInsertStation=Math.floor(y/56)+1;
        if(y%56>14&&y%56<42){
          this.showInsertStation=true;
        }else{
          this.showInsertStation=false;
        }
      }
    }
  }

  /**
   *　＋マークの位置
   */
  private transformY():string{
    return "translate(0,"+(this.routeService.posInsertStation*56+14)+")";
  }

  /**
   * 路線に駅を追加するモードにする。（＋マークを固定する。)
   * frag=falseの時は＋マークの固定を解除する。
   */
  private addStationMode(frag:boolean){
    if(frag){
      //mapをタッチして駅が入力されるのを待つ
      //１、駅クリックのイベントコールバックを仕掛ける
      //２、railMapMouseMoveを一時停止する(クリックで再び使用可能にする。)
      this.enableRailMapMouse=false;
      this.routeService.setStationAddMode(this.routeService.posInsertStation);
    }else{
      this.enableRailMapMouse=true;
    }
  }


  /**
   * 路線から駅を削除する
   */
  private deleteStation(station:RouteStation){
    this.routeService.deleteStation(station);
    this.init();
  }

  /**
   * 路線を削除する
   */
  private deleteRoute(){
    this.routeService.deleteRoute();
  }

  /**
   * 新規路線を作成する。
   */
  private makeNewRoute(){
    this.routeService.makeNewRoute();
  }
}

/**
 * 内部クラス。
 * 路線所属する駅用のデータ
 */
class StationData{
  public y1=0;
  public y2=0;
  public routeStation:RouteStation=new RouteStation();
  public station:Station=new Station();
}
