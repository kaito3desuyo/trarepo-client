import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {JPTI} from "../../lib/JPTI/JPTI";
import Route = JPTI.Route;
import RouteStation = JPTI.RouteStation;
import {RoutemapService} from "../routemap/routemap.service";

@Injectable({
  providedIn: 'root'
})
export class RouteService {
  //キャッシュしたrouteのリスト。ここにあるrouteは基本的にAPIを読みにいかない。
  public cacheRoute:{[key:string]:Route}={};
  //現在編集するroute
  private route:BehaviorSubject<Route>=new BehaviorSubject(null);
  //route内で駅を挿入する場所
  public  posInsertStation:number=0;
  //駅追加モードになっているか？
  private stationInsertMode:boolean=false;
  //互いに注入しあうのを防ぐため、後からroutemapを設定する。
  private routemapService:RoutemapService;
  public setRouteMapService(routeMapService:RoutemapService){
    this.routemapService=routeMapService;
  }

  constructor() {
    const route=new Route();
    route.asNullRoute();
    this.route.next(route);
  }
  getRoute():Observable<Route>{
    return this.route.asObservable();
  }

  //サーバーからrouteを取得する。
  public setRouteByID(routeID:string){
    var req = new XMLHttpRequest();
    req.onreadystatechange = () =>{
      if(req.readyState == 4 && req.status == 200){
        console.log(req.response);
        const route=new Route();
        const json=JSON.parse(req.response)["route"];
        route.loadFromJSON(json[Object.keys(json)[0]]);
        this.route.next(route);
        this.cacheRoute[route.id]=route;
      }
    };
    req.open("GET", "https://kamelong.com/nodeJS/api/route?routeID="+routeID, false);
    req.send(null);
  }

  //非推奨関数
  public setRouteByName(routeName:string){

    var req = new XMLHttpRequest();
    req.onreadystatechange = () =>{
      if(req.readyState == 4 && req.status == 200){
        const route=new Route();
        const json=JSON.parse(req.response)["route"];

        route.loadFromJSON(json[Object.keys(json)[0]]);
        console.log(route);
        this.route.next(route);
      }
    };
    req.open("GET", "https://kamelong.com/nodeJS/api/route?routeName="+routeName, false);
    req.send(null);
  }

  //挿入場所を設定して、駅追加モードにする。
  public setStationAddMode(insertPosition:number){
    this.stationInsertMode=true;
    this.posInsertStation=insertPosition;
  }

  //今編集している駅を削除する。
  public deleteRoute(){
    //todo route削除処理をサーバーに投げること。
    //内部データも削除する。
    const deleteID=this.route.getValue().id;
    delete this.cacheRoute[deleteID];
    const route=new Route();
    route.asNullRoute();
    this.route.next(route);
    //todo routeが変更されたのでサーバー側も変更する
    this.routemapService.changeRoute(deleteID);
  }

  //路線新規作成
  public makeNewRoute(){
    const route=new Route();
    route.name="新規路線";
    this.route.next(route);
    this.cacheRoute[route.id]=route;
    //todo routeが変更されたのでサーバー側も変更する
    this.routemapService.changeRoute(route.id);
  }

  //駅を追加する。
  public selectStation(stationID:string){
    if(this.stationInsertMode){
      var req = new XMLHttpRequest();
      req.onreadystatechange = () =>{
        if(req.readyState == 4 && req.status == 200){
          const responce=JSON.parse(req.response);
          const station=new RouteStation();
          station.station.loadFromJSON(responce);
          this.route.getValue().stations.splice(this.posInsertStation,0,station);
          this.posInsertStation++;
          this.route.next(this.route.getValue());
          this.routemapService.changeRoute(this.route.getValue().id);

        //todo routeが変更されたのでサーバー側も変更する

        }
      };
      req.open("GET", "https://kamelong.com/nodeJS/api/station?stationID="+stationID, false);
      req.send(null);

    }
  }
  /**
   * 路線から駅を削除する
   */
  public deleteStation(station:RouteStation){
    const index=this.route.getValue().stations.indexOf(station);
    if(index>this.posInsertStation){
      this.posInsertStation--;
    }
    this.route.getValue().stations.splice(index,1);
    this.routemapService.changeRoute(this.route.getValue().id);
  }

}
