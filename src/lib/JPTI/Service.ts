import UUID from 'uuid/v4'
import {Route, RouteStation} from "./Route";

export class Service{
  private _id:string=UUID();
  get id():string{
    return this._id;
  }
  public name:string="";
  public description:string=null;
  public routes:Array<LineSystem>=[];
}

export class LineSystem{
  private _id:string=UUID();
  get id():string{
    return this._id;
  }
  public route:Route=null;
  public service:Service=null;
  public startStation:RouteStation=null;
  public endStation:RouteStation=null;
}
