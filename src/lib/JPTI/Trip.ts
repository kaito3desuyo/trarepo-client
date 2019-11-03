import UUID from 'uuid/v4';
import {Service} from "./Service";
import {Agency} from "./Agency";
import {Route} from "./Route";
import {Operation} from "./Operation";
import {TripClass} from "./TripClass";
import {Calendar} from "./Calendar";
import {StopTime} from "./StopTime";
export class Trip {
  private _id: string = UUID();
  get id(): string {
    return this._id;
  }
  public service:Service=null;
  public operations:Array<TripOperation>=[];
  public tripNumber:string=null;
  public classID:TripClass=null;
  public name:string="";
  public blockID:string=null;
  public calendar:Calendar=null;



}
export class TripOperation{
  private _id: string = UUID();
  get id(): string {
    return this._id;
  }
  public trip:Trip=null;
  public operation:Operation=null;
  public startStopTime:StopTime=null;
  public endStopTime:StopTime=null;
}
