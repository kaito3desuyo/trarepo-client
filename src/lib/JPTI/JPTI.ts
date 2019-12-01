import UUID from 'uuid/v4';

export namespace JPTI{
    export enum AgencyType{
        NONE,
        TRAIN1,
        TRAIN2,
        TRAIN3,
        NORMAL_BUS,
        FERRY,
        AIRPLANE,
        OTHER
    }
    export class Agency{
        private _id:string=UUID();
        get id():string{
            return this._id;
        }
        public name:string="";
        public number:string=null;
        public parentAgencyID:string=null;
        public agencyType:AgencyType=AgencyType.TRAIN1;
        public agencyURL:string=null;
        public agencyPhone:string=null;
        public agencyFareURL:string=null;

    }
    export class Calendar {
        private _id: string = UUID();
        get id(): string {
            return this._id;
        }
        public service:Service=null;
        public name:string="";
    }
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

    export enum OperationType{
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
    /**
     * Enumeration of JPTIroute.routeType
     */
    enum RouteTypeList{
        HIGH_SPEED_TRAIN,
        NORMAL_TRAIN,
        METRO,
        CITY_TRAIN,
        CABLE_CAR,
        ROPEWAY,
        HIGHWAY_BUS,
        NORMAL_BUS,
        COMMUNITY_BUS,
        FERRY,
        LOCAL_FERRY,
        AIR_PLANE,
        OTHER}

    /**
     * This class is equivalent to a route of JPTI.
     */

    export class Route{
        /**
         *  ID of this station.
         *  Each station in the database must have unique ID.
         *  Use UUID V4 type string.
         *
         *  Users can't change or set the ID.
         *
         */
        private _id:string=UUID();
        get id():string{
            return this._id;
        }

        /**
         * Deprecated function
         */
        public setID(id:string){
            this._id=id;
        }
        /**
         * parent agency of the route.
         */
        public agency:any=null;
        /**
         * Numbering of the route.
         */
        public routeNo:string="";
        /**
         * see [enum RouteTypeList]
         * Users must select a type.
         */
        public routeType:RouteTypeList=RouteTypeList.NORMAL_TRAIN;
        /**
         * A name of the route.
         * RouteMAP show this name as the route.
         */
        public name:string="";
        /**
         * A sub name of the route.
         * This name is not used by RouteMAP
         */
        public nickName:string=null;
        /**
         * A comment for the route.
         */
        public description:string="";
        /**
         * For a link of the route.
         */
        public url:string=null;
        /**
         * RouteMAP's line become this color.
         * color format must be '#RRGGBB'.
         */
        public color:string="#000000";
        /**
         * Color for timetable?
         */
        public textColor:string=null;

        /**
         * The stations that make up this route
         */
        public routeStations:Array<RouteStation>=[];

        public loadFromJSON(value:JSON){
          console.log(value);
            this._id=value["id"];
            this.name=value["name"];
            this.color=value["color"];
            this.routeStations==[];
            for(var i=0; i<value["stationList"].length;i++){
              const routeStation=new RouteStation();
              routeStation.stationID=value["stationList"][i];
              this.routeStations.push(routeStation);
            }
        }

        public asNullRoute(){
            this._id="";
        }
        public isNull():boolean{
            return this.id.length==0;

        }
    }
    export class RouteStation{
        private _id:string=UUID();
        get id():string{
            return this._id;
        }
        public stationID:string="";

    }
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
    /**
     * Enumeration of JPTIstation.stationType
     */
    enum StationTypeList{TRAIN_STATION,BUS_STOP,FERRY_PORT,AIR_PORT}

    /**
     * This class is equivalent to a station of JPTI.
     */
    export class Station{
        /**
         *  ID of this station.
         *  Each station in the database must have unique ID.
         *  Use UUID V4 type string.
         *
         *  User can't change or set the ID.
         *
         */
        private _id:string=UUID();
        get id():string{
            return this._id;
        }

        /**
         * Deprecated function
         */
        public setID(id:string){
            this._id=id;
        }
        /**
         * Name of the station.
         * Not NULL.
         */
        public name:string="新規駅名";
        /**
         * Vehicle type of the station.
         */
        public type:StationTypeList=StationTypeList.TRAIN_STATION;
        /**
         * When the station has numbering,
         * use this property.
         *
         * Nullable.
         */
        public number:string=null;
        /**
         * Description of the station.
         * You can use this for any information of the station.
         */
        public description:string=null;
        /**
         * A latitude of the station.
         * The latitude is wrote as float.
         * Plus number means north latitude.
         * Minus number means south latitude.
         */
        public lat:number=0;

        /**
         * A longitude of the station.
         * The longitude is wrote as float.
         * Plus number means east longitude.
         * Minus number means west longitude.
         */
        public lon:number=0;

        /**
         * Stops that belong to the station.
         * These stops must have same stationID as this station's ID.
         */
        public stops:Array<Stop>=[];
        public loadFromJSON(value:JSON){
            this._id=value["id"];
            this.name=value["name"];
            this.lat=value["lat"];
            this.lon=value["lon"];
        }

        /**
         * add new stop into last of this.stops
         * The stop has same lat and lon with this station.
         */
        public addNewStop(){
            const stop=new Stop(this);
            stop.lat=this.lat;
            stop.lon=this.lon;
            this.stops.push(stop);
        }
        /**
         * add new stop into any position of this.stops
         * The stop has same lat and lon with this station.
         */
        public addNewStopAt(index:number){
            const stop=new Stop(this);
            stop.lat=this.lat;
            stop.lon=this.lon;
            this.stops.splice(index, 0, stop);
        }

        /**
         * delete the stop
         * return true :success to delete
         * return false:fail to delete
         */
        public deleteStop(stop:Stop):boolean{
            const stopIndex=this.stops.indexOf(stop);
            if(stopIndex>=0&&stopIndex<this.stops.length){
                this.stops.splice(stopIndex,1);
                return true;
            }
            return false;

        }
        /**
         * Move stop one position forward the list
         * return true :success to move
         * return false:fail to move
         */
        public upperStop(stop:Stop):boolean{
            const stopIndex=this.stops.indexOf(stop);
            if(stopIndex>0&&stopIndex<this.stops.length){
                this.stops.splice(stopIndex,1);
                this.stops.splice(stopIndex-1,0,stop);
                return true;
            }
            return false;
        }



    }
    /**
     * This class is equivalent to a stop of JPTI.
     * An example of stop is platform or bus poll.
     */
    export class Stop{
        /**
         * station:
         * A parent station of the stop.
         * User can't change or set station
         */
        constructor(public station:Station){

        }
        /**
         *  ID of this stop.
         *  Each station in the database must have unique ID.
         *  Use UUID V4 type string.
         *
         *  User can't change or set the ID.
         */

        private _id:string=UUID();
        get id():string{
            return this._id;
        }

        /**
         * A name of the stop
         * Not NULL
         */
        public name:string="新規番線";
        /**
         * Description of the stop.
         * You can use this for any information of the stop.
         */
        public description:string=null;
        /**
         * A latitude of the stop.
         * The latitude is wrote as float.
         * Plus number means north latitude.
         * Minus number means south latitude.
         */
        public lat:number=0;

        /**
         * A longitude of the stop.
         * The longitude is wrote as float.
         * Plus number means east longitude.
         * Minus number means west longitude.
         */
        public lon:number=0;

        /**
         * This zone is used for fare calculation.
         * Bus often define fares only between fare zones.
         *
         * Nullable
         */
        public zoneID:string=null;



    }
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
    export class TripClass {
        private _id: string = UUID();
        get id(): string {
            return this._id;
        }
        public service:Service=null;
        public name:string="";
        public color:string="";
    }
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

}
