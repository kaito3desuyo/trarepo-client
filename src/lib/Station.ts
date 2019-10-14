import UUID from 'uuid/v4'
import {Stop} from './Stop';

/**
 * Enumeration of Station.stationType
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
