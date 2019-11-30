import {ApiRoute, ApiStation} from "./a_hanyou";
import {JPTI} from "../../lib/JPTI/JPTI";
import Route = JPTI.Route;
import Station = JPTI.Station;
import RouteStation = JPTI.RouteStation;

export class KLAPI {
	public route:{[key:string]:ApiRoute}={};
	public station:{[key:string]:ApiStation}={};
}
export class JPTIapi{
	public routes:{[key:string]:Route}={};
	public stations:{[key:string]:Station}={};

	public putKLAPI(kl:KLAPI){
		for(let stationID in kl.station){
			const station=new Station();
			station.setID(stationID);
			station.name=kl.station[stationID].name;
			station.lat=kl.station[stationID].lat;
			station.lon=kl.station[stationID].lon;
			this.stations[stationID]=station;
		}
		for(let routeID in kl.route){
			const route=new Route();
			route.setID(routeID);
			route.name=kl.route[routeID].name;
			route.color=kl.route[routeID].color;
			for(const s of kl.route[routeID].stationList){
				const routeStation=new RouteStation();
				routeStation.station=this.stations[s];
				route.stations.push(routeStation);
			}
			this.routes[routeID]=route;

		}

	}

}

export function f_xhr_get(a_url:string, a_type:XMLHttpRequestResponseType):Promise<JPTIapi>{
	return new Promise<JPTIapi>((resolve, reject) => {
		function f_reject() {
			reject(new Error("XHR失敗"));
		}
		const c_xhr = new XMLHttpRequest();
		c_xhr.responseType = a_type;
		c_xhr.open("get", a_url);
		c_xhr.onloadend = ()=>{
			if (c_xhr.status === 200) {
				const res=c_xhr.response;
				const kl=res as KLAPI;
				const jptiData=new JPTIapi();
				jptiData.putKLAPI(kl);
				resolve(jptiData);
			} else {
				f_reject();
			}
		};
		c_xhr.onabort = f_reject;
		c_xhr.ontimeout = f_reject;
		c_xhr.send(null);
	});
}
