import UUID from 'uuid/v4';
import {Service} from "./Service";
import {Agency} from "./Agency";
import {Route} from "./Route";
import {Operation} from "./Operation";
import {VehicleFormation} from "./Vehicle";
export class Formation {
  private _id: string = UUID();
  get id(): string {
    return this._id;
  }
  public agency:Agency=null;
  public type:string=null;
  public formationNumber:string=null;
  public description:string=null;
  public vehicles:Array<VehicleFormation>=[];
}
