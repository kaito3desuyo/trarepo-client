import UUID from 'uuid/v4'
import {Stop} from './Stop';
import {Station} from './Station';
/**
 * Enumeration of Route.routeType
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
    public stations:Array<Station>=[];

    public loadFromJSON(value:JSON){
        this._id=value["id"];
        this.name=value["name"];
        this.color=value["color"];

    }






}
