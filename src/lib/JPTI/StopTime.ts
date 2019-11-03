import UUID from 'uuid/v4';
import {Trip} from "./Trip";
import {Stop} from "./Stop";

enum stopType{
  ENABLE,
  DISABLE,
  RESERVATION,
  DRIVER_RESERVATION
}
export class StopTime {
  private _id: string = UUID();
  get id(): string {
    return this._id;
  }
  public trip:Trip=null;
  public stop:Stop=null;
  public pickUpType:stopType=stopType.ENABLE;
  public dropOffType:stopType=stopType.ENABLE;
  public arrivalTime:number=-1;
  public departureTime:number=-1;
  public arrivalDay:number=0;
  public departureDay:number=0;
  public depotIn:boolean=false;
  public deportOut:boolean=false;
}
