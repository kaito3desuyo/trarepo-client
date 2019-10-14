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
  private nowStationID:string;


  constructor() {
    const station=new Station();
    this.stations[station.id]=station;
    this.nowStationID=station.id;
  }
  getStation():Observable<Station>{
    return of(this.stations[this.nowStationID]);
  }


}
