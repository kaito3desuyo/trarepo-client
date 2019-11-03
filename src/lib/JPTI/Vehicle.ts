import UUID from 'uuid/v4';
import {Service} from "./Service";
import {Agency} from "./Agency";
import {Route} from "./Route";
import {Operation} from "./Operation";
import {Formation} from "./Formation";
export class Vehicle {
  private _id: string = UUID();
  get id(): string {
    return this._id;
  }
  public formations:Array<Formation>=[];
  public vehicleNumber:string=null;
  public belongs:string=null;

}
export class VehicleFormation{
  private _id: string = UUID();
  get id(): string {
    return this._id;
  }
  public vehicle:Vehicle=null;
  public formation:Formation=null;
  public carNumber:number=null;

}
