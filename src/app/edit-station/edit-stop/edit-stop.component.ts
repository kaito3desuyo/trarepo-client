import { Component, OnInit,Input } from '@angular/core';
import {JPTI} from "../../../lib/JPTI/JPTI";
import Stop = JPTI.Stop;
@Component({
  selector: 'app-edit-stop',
  templateUrl: './edit-stop.component.html',
  styleUrls: ['./edit-stop.component.scss']
})
export class EditStopComponent implements OnInit {
  @Input() stop:Stop;
  constructor() { }

  ngOnInit() {
  }

  public deleteStop(){
    this.stop.station.deleteStop(this.stop);
  }
  public addStop(){
    this.stop.station.addNewStopAt(this.stop.station.stops.indexOf(this.stop));
  }

}
