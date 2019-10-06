import { Injectable } from '@angular/core';
import { Station} from '../../lib/Station';
import { Observable, of } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class StationService {
  private stations:{[key:string]:Station;}={};
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
