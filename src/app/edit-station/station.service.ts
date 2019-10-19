import { Injectable } from '@angular/core';
import { Station} from '../../lib/Station';
import { Observable, of } from 'rxjs';
import {Stop} from '../../lib/Stop';
@Injectable({
  providedIn: 'root'
})
export class StationService {
  private stations:{[key:string]:Station;}={};

  private deteleStations:Array<Station>=[];
  private deteleStops:Array<Stop>=[];
  private updateStations:Array<Station>=[];
  private updateStops:Array<Stop>=[];
  private nowStation:Station;
  private obser:Observable<Station>;


  constructor() {
    const station=new Station();
    this.stations[station.id]=station;
    this.nowStation=station;
    this.obser=of(this.nowStation);
  }
  getStation():Observable<Station>{
    return this.obser;
  }
  makeNewStation(lat:number,lon:number){
    const newStation=new Station();
    newStation.lat=lat;
    newStation.lon=lon;
    this.stations[newStation.id]=newStation;
    this.nowStation=newStation;
    this.obser.subscribe();
  }


}
