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
    public stations:Array<RouteStation>=[];

    public loadFromJSON(value:JSON){
        this._id=value["id"];
        this.name=value["name"];
        this.color=value["color"];
        for(var i=0; i<value["stationList"].length;i++){
            const j=i;
            this.stations.push(new RouteStation());
            const req = new XMLHttpRequest();
            req.onreadystatechange = () =>{
                if(req.readyState == 4 && req.status == 200){
                    const responce=JSON.parse(req.response);
                    this.stations[j].station.loadFromJSON(responce);
                }
            };
            req.open("GET", "https://kamelong.com/nodeJS/api/station?stationID="+value["stationList"][j], true);
            req.send(null);
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
  public station:Station=new Station();

}
