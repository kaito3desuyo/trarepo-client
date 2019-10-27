import { Injectable } from '@angular/core';
import {Route} from '../../lib/Route';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {Station} from "../../lib/Station";

@Injectable({
  providedIn: 'root'
})
export class RouteService {
  private route:BehaviorSubject<Route>=new BehaviorSubject(null);

  constructor() {
    this.route.next(new Route());
  }
  getRoute():Observable<Route>{
    return this.route.asObservable();
  }
  public getRouteFromName(name:string){
    var req = new XMLHttpRequest();
    req.onreadystatechange = () =>{
      if(req.readyState == 4 && req.status == 200){
        const route=new Route();
        route.loadFromJSON(JSON.parse(req.response)["route"]);
        this.route.next(route);
      }
    };
    req.open("GET", "https://kamelong.com/nodeJS/api/route?name="+name, false);
    req.send(null);
  }
  public getRouteFromID(routeID:string){
    var req = new XMLHttpRequest();
    req.onreadystatechange = () =>{
      if(req.readyState == 4 && req.status == 200){
        const route=new Route();
        route.loadFromJSON(JSON.parse(req.response)["route"]);
        this.route.next(route);
      }
    };
    req.open("GET", "https://kamelong.com/nodeJS/api/route?id="+routeID, false);
    req.send(null);

  }

}
