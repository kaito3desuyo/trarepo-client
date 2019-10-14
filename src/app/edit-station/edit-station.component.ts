import { Component, OnInit, Input } from '@angular/core';
import { StationService } from './station.service';
import {Station} from '../../lib/Station';
@Component({
  selector: 'app-edit-station',
  templateUrl: './edit-station.component.html',
  styleUrls: ['./edit-station.component.scss']
})
export class EditStationComponent implements OnInit {

  /**
   * A station that is edited now.
   * When this is changed, current station info is saved and editor view is updated.
   */
  private station:Station=null;

  constructor(private stationService:StationService) { }

  ngOnInit() {
    this.stationService.getStation().subscribe(station=>this.station=station);
  }

  /**
   * add new stop to this.station
   */
  addNewStop(){
    this.station.addNewStop();
  }
}
