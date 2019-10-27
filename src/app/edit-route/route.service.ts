import { Injectable } from '@angular/core';
import {Route} from '../../lib/Route';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RouteService {

  public routeID:string=null;
  public route:Route=null;
  constructor() { }
  getRoute():Observable<Route>{
    return of(this.route);
  }

}
