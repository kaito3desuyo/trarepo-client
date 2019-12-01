import { Component, OnInit, Input } from '@angular/core';
import { StationService } from './station.service';
import {JPTI} from "../../lib/JPTI/JPTI";
import Station = JPTI.Station;
import {RoutemapService} from "../routemap/routemap.service";
declare const window: any;
declare const setStopCallback: any;
@Component({
  selector: 'app-edit-station',
  templateUrl: './edit-station.component.html',
  styleUrls: ['./edit-station.component.scss']
})
export class EditStationComponent implements OnInit {

  /**
   * 今編集している駅
   */
  public station:Station=null;

  constructor(private stationService:StationService) { }

  ngOnInit() {
    this.stationService.getEditStation().subscribe(station=>this.station=station);
    window.openStation=function (id:string) {
      console.log(id)
    };
  }

  /**
   * この駅に新規Stopを追加する。
   */
  addNewStop(){
    this.station.addNewStop();
  }

}
