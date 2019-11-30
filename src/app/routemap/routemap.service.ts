import {Injectable, OnInit} from '@angular/core';
import {RouteMAP} from "./busmap";
import RouteMapMain = RouteMAP.RouteMapMain;
import {RouteService} from "../edit-route/route.service";
import {StationService} from "../edit-station/station.service";
import {MatTabChangeEvent} from "@angular/material";
import Route = RouteMAP.Route;
import Station = RouteMAP.Station;
import {f_xhr_get} from "./f_xhr_get";
import MapBound = RouteMAP.MapBound;
import {JPTI} from "../../lib/JPTI/JPTI";
import * as L from "leaflet";

@Injectable({
  providedIn: 'root'
})
export class RoutemapService {

  //表示するMAP
  public routeMap:RouteMapMain=undefined;

  //今表示すべきroute一覧
  public readonly showRoutes:{[key:string]:Route}={};
  //今表示すべき駅一覧（範囲内にある駅）
  public readonly showStations:{[key:string]:Station}={};

  //新規追加駅として使用する座標(一時的な保管用)
  private newStationLat=0;
  private newStationLon=0;

  //今　路線編集のタブを開いているかどうか？
  public onFocusRouteEdit:boolean=false;
  //今　駅編集のタブを開いているかどうか？
  public onFocusStationEdit:boolean=true;

  constructor(private routeService:RouteService,private stationService:StationService) {
    this.routeService.setRouteMapService(this);
    this.stationService.setRouteMapService(this);

    this.routeMap=new RouteMapMain(this,this.showRoutes,this.showStations);
    //routeMapのイベント処理
    this.routeMap.setRouteClickedListener((routeID:string)=> {
      if(this.onFocusRouteEdit){
        this.routeService.setRouteByID(routeID);
      }
    });
    this.routeMap.setStationClickedListener((stationID:string)=>{
      if(this.onFocusStationEdit){
        this.stationService.setNowStation(stationID);
      }
      if(this.onFocusRouteEdit){
        this.routeService.selectStation(stationID);
      }
    })

  }
  //駅・路線などのタブレイアウトが変更された時
  public onTabChange(event:MatTabChangeEvent){
    if(event.index==0){
      //駅編集
      this.onFocusStationEdit=true;
      this.onFocusRouteEdit=false;
    }
    if(event.index==1){
      //路線編集
      this.onFocusStationEdit=false;
      this.onFocusRouteEdit=true;
    }
  }


  //kamelong.comのAPIを使うときの処理
  public async loadDataFromAPI(mapBound:MapBound){
    const time=new Date().getTime();
    //ここでrouteとstationを初期化する。
    const jptiData=await f_xhr_get("https://kamelong.com/nodeJS/api?"+mapBound.getAPIparam()+"&zoomLevel=10", "json");
    for(var stationID in this.showStations){
      delete this.showStations[stationID];
    }
    for(let stationID in jptiData.stations){
      if(stationID in this.stationService.cacheStation){
      }else{
        this.stationService.cacheStation[stationID]=jptiData.stations[stationID];
      }
    }

    for(var routeID in this.showRoutes){
      delete this.showRoutes[routeID];
    }
    for(let routeID in jptiData.routes){
      if(routeID in this.routeService.cacheRoute){
      }else{
        this.routeService.cacheRoute[routeID]=jptiData.routes[routeID];
      }
      const route=new Route();
      route.jptiRoute=this.routeService.cacheRoute[routeID];
      this.showRoutes[routeID]=route;
      for(var stationIndex=0; stationIndex<route.jptiRoute.routeStations.length; stationIndex++){
        const stationID=route.jptiRoute.routeStations[stationIndex].stationID;
        const station=new Station();
        station.jptiStation=this.stationService.cacheStation[stationID];
        this.showStations[station.jptiStation.id]=station;
      }
    }
    console.log("loadDataFromAPI:"+(new Date().getTime()-time));
  }
  //routeの変更を路線図に反映
  public changeRoute(routeID:string){
    this.routeMap.clearMap();
    if(routeID in this.routeService.cacheRoute){
      const route=new Route();
      route.jptiRoute=this.routeService.cacheRoute[routeID];
      this.showRoutes[routeID]=route;
    }else{
      delete this.showRoutes[routeID];
    }
    this.routeMap.init();

  }
  //stationの変更を路線図に反映
  public changeStation(stationID:string){
    console.log(stationID);
    this.routeMap.clearMap();
    const station=new Station();
    station.jptiStation=this.stationService.cacheStation[stationID];
    this.showStations[stationID]=station;
    this.routeMap.init();
  }
  //新規駅作成
  //先にprepareNewStationを使って、lat lon を用意しておくこと
  public makeNewStation(){
    this.dismissMenu();
    this.stationService.makeNewStation(this.newStationLat,this.newStationLon);
  }

  public dismissMenu(){
    var menu = document.getElementById('mapMenu');
    menu.style.display = "none";
  }
  //MAPを右クリックされたら、新規駅を作る準備(座標の登録)
  public prepareNewStation(e:MouseEvent){
      console.log("click");
      var menu = document.getElementById('mapMenu');
      console.log(menu);
      menu.style.display = "block";
      var origin=this.routeMap.leafletMap.getPixelOrigin();
      console.log(origin);
      var posX = e.offsetX;
      var posY = e.offsetY;
    console.log(posX+","+posY);
      menu.style.left = e.clientX + 'px';
      menu.style.top = e.clientY + 'px';
      var pointXY =L.point(posX, posY);
      var pointlatlng =     this.routeMap.leafletMap.mouseEventToLatLng(e);
      console.log(pointlatlng);
      this.newStationLat = pointlatlng["lat"];
      this.newStationLon = pointlatlng["lng"];
    }



}
