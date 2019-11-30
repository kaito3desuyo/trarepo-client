import {LatLng, Point} from "leaflet";

export class ApiStation{
    public id:string="";
    public name:string="";
    public lat:number=0;
    public lon:number=0;
}
export class ApiRoute{
    public stationList:Array<string>=[];//stationのID
    public name:string="";
    public color:string="";
    public id:string="";
    // public l_polyline:Polyline=null;
    // public polyline:LatLng[]=[];
    // public l_points:CircleMarker[]=null;
    // public points:Point2[]=null;
}
export class StationXY{
    public x=0;
    public y=0;
    constructor(x:number,y:number){
        this.x=x;
        this.y=y;
    }
}
export class Segment{
    public sid="";//startStation ID
    public eid="";//endStation ID
    // public sids:string[]=[];
    // public eids:string[]=[];
    public sx=0;
    public sy=0;
    public ex=0;
    public ey=0;
    public sn=true;
    public en=true;
    public w:number=null;
    public z:number=null;
    public st=0;
    public et=0;
    public sxy:Point[]=[];
    public exy:Point[]=[];
}

export class Offset{
    public d1t=[0,0,0];
    public d2t=[0,0,0];
    public xy:Point3[]=[];
}

export class PolyLine{
    public ids:string[]=[];
    public lon=0;
    public lat=0;
    public x=0;
    public y=0;
}
export class SegmentList{
    public segments:{[key:string]:SubSegment}={};
     public number=0;
}
export class SubSegment{
    public id="";
    public direction=1;
    public w=0;
    public z=0;
}

export class Point2{
    public id="";
    public latlon:LatLng=null;
}
export class Point3{
    public x:number[]=[];
    public y:number[]=[];
    constructor(x:number[],y:number[]){
        this.x=x;
        this.y=y;
    }
}