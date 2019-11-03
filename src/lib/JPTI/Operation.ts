import UUID from 'uuid/v4';
import {Service} from "./Service";
import {Agency} from "./Agency";
import {Route} from "./Route";
import {Trip, TripOperation} from "./Trip";
import {Calendar} from "./Calendar";
enum OperationType{
  PUBLIC_OPERATION,//複数社統一運用
  PRIVATE_OPERATION,//1社統一運用
}

export class Operation{
  private _id:string=UUID();
  get id():string{
    return this._id;
  }
  public calendar:Calendar=null;
  public operationNumber=null;
  public trips:Array<TripOperation>=[];
}
