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
    private _id:string=UUID();
    public agency:any=null;
    public routeNo:string=null;
    public routeType:RouteTypeList=RouteTypeList.NORMAL_TRAIN;
    public name:string="";
    public nickName:string=null;
    public description:string=null;
    public url:string=null;
    public color:string=null;
    public textColor:string=null;

    public stations:Array<Station>=[];





}
