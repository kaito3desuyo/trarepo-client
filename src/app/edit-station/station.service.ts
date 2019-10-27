import { Injectable } from '@angular/core';
import { Station} from '../../lib/Station';
import {BehaviorSubject, Observable, of, Subject} from 'rxjs';
import {Stop} from '../../lib/Stop';
import {__await} from "tslib";
@Injectable({
  providedIn: 'root'
})
export class StationService {
  private stations:{[key:string]:Station;}={};

  private deteleStations:Array<Station>=[];
  private deteleStops:Array<Stop>=[];
  private updateStations:Array<Station>=[];
  private updateStops:Array<Stop>=[];

  private nowStation:BehaviorSubject<Station>=new BehaviorSubject(null);


  constructor() {
    this.loadStationFromKLAPI(34,36,135,136);

  }
  getStation():Observable<Station>{
    return this.nowStation.asObservable();
  }
  makeNewStation(lat:number,lon:number){
    const newStation=new Station();
    newStation.lat=lat;
    newStation.lon=lon;
    this.stations[newStation.id]=newStation;
    this.nowStation.next(newStation);
  }
  loadStationFromKLAPI(minLat:number,maxLat:number,minLon:number,maxLon:number){
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
  addStation(value:JSON){
    const station=new Station();
    station.loadFromJSON(value);
    this.stations[station.id]=station;
  }
  setNowStation(id:string){
    if(id in this.stations){
      this.nowStation.next(this.stations[id]);
    }

  }



}
