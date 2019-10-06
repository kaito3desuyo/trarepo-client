import UUID from 'uuid/v4'

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


}
