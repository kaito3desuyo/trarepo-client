import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, of, Subject} from 'rxjs';
import {__await} from "tslib";
import {JPTI} from "../../lib/JPTI/JPTI";
import Station = JPTI.Station;
import Stop = JPTI.Stop;
import {RoutemapService} from "../routemap/routemap.service";
@Injectable({
  providedIn: 'root'
})
export class StationService {
  //キャッシュとして保存している駅
  public  cacheStation:{[key:string]:Station;}={};

  //今編集する駅
  private nowStation:BehaviorSubject<Station>=new BehaviorSubject(null);

  //相互に注入することを防ぐために、routemapは後から設定する。
  private routemapService:RoutemapService;

  //routemap側から呼び出すこと
  public setRouteMapService(routeMapService:RoutemapService){
    this.routemapService=routeMapService;
  }

  constructor() {
    var req = new XMLHttpRequest();
    req.onreadystatechange = () =>{
      if(req.readyState == 4 && req.status == 200){
        const responce=JSON.parse(req.response);
        for(var id in responce){
          this.addStation(responce[id]);
        }
      }
    };
    req.open("GET", "https://kamelong.com/nodeJS/api/station", false);
    req.send(null);
  }

  public async getStation(stationID:string):Promise<Station>{
    if(stationID in this.cacheStation){
    }else{
      await this.loadStation(stationID);

    }
    return this.cacheStation[stationID];
  }

  private loadStation(stationID:string):Promise<Station>{
    return new Promise<Station>(resolve => {
      var req = new XMLHttpRequest();
      req.onreadystatechange = () =>{
        if(req.readyState == 4 && req.status == 200){
          const responce=JSON.parse(req.response)["station"];
          for(var id in responce){
            this.addStation(responce[id]);
          }
        }
        resolve();
      };
      req.open("GET", "https://kamelong.com/nodeJS/api", false);
      req.send(null);
    })
  }

  //今表示するべき駅
  public getEditStation():Observable<Station>{
    return this.nowStation.asObservable();
  }

  //新規駅を作る
  public makeNewStation(lat:number,lon:number){
    const newStation=new Station();
    newStation.lat=lat;
    newStation.lon=lon;
    this.cacheStation[newStation.id]=newStation;
    this.nowStation.next(newStation);
    this.routemapService.changeStation(newStation.id);
  }

  //APIから駅を読み込む
  public loadStationFromKLAPI(minLat:number,maxLat:number,minLon:number,maxLon:number){
      var req = new XMLHttpRequest();
      req.onreadystatechange = () =>{
        if(req.readyState == 4 && req.status == 200){
          const responce=JSON.parse(req.response)["station"];
          for(var id in responce){
            this.addStation(responce[id]);
          }
        }
      };
      req.open("GET", "https://kamelong.com/nodeJS/api?minLat="+minLat.toString()+"&maxLat="+maxLat.toString()+"&minLon="+minLon.toString()+"&maxLon="+maxLon.toString()+"&zoomLevel=10", false);
      req.send(null);
  }
  //jsonから駅を追加する
  public addStation(value:JSON){
    const station=new Station();
    station.loadFromJSON(value);
    this.cacheStation[station.id]=station;
  }

  //編集する駅を設定する
  public setNowStation(id:string){
    if(id in this.cacheStation){
      this.nowStation.next(this.cacheStation[id]);
    }
  }
}
