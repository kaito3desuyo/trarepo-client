import UUID from 'uuid/v4'
import {Station} from './Station';
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

