import UUID from 'uuid/v4';
import {Service} from "./Service";
import {Agency} from "./Agency";
import {Route} from "./Route";
import {Operation} from "./Operation";
export class TripClass {
  private _id: string = UUID();
  get id(): string {
    return this._id;
  }
  public service:Service=null;
  public name:string="";
  public color:string="";
}

