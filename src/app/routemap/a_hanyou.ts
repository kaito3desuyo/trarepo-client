import {CircleMarker, LatLng, Point} from "leaflet";

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
export class CrossPont{
    public x=0;
    public y=0;
    public parallel=false;
}
export class Offset{
    public d1t=[0,0,0];
    public d2t=[0,0,0];
    public xy:Point3[]=[];
}
export class Point3{
    public x:number[]=[];
    public y:number[]=[];
    constructor(x:number[],y:number[]){
        this.x=x;
        this.y=y;
    }
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
export class InputSetting{
    public cors_url: string="";//CORSの問題を回避するため、間にサーバーサイドのプログラムを挟む場合に前に加えるURL
    public rt:boolean =false;//GTFS-RTの読込
    public data:string ="data";//データのURL
    public data_type: string="gtfs";//データがgtfs; json; geojson; topojson; apiか
    public div_id: string="div";//挿入するdivのid
    public global:boolean =true;//trueの場合、値をc_globalに渡し、変更可能にする
    public change: boolean=true;
    public leaflet: boolean=true;
    public clickable:boolean =true;//線等をクリックできる
    public timetable:boolean =true;//時刻表を表示する
    public direction:boolean =true;
    public parent_route_id:string="route_id";
    public stop_name: boolean=true;
    public stop_name_overlap:boolean=true;
    public zoom_level:number =16;
    public svg_zoom_level:number =16; //互換性のため残す
    public svg_zoom_ratio: number=0; //SVG表示縮小率=zoom_level - svg_zoom_level
    public background_map: boolean=true;
    public background_layers=[["https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png", {attribution: "<a href=\"https://maps.gsi.go.jp/development/ichiran.html\">地理院タイル</a>", opacity: 0.25}]];
    public font_size:number =16; //停留所名のフォントサイズ
    public font_family: string="'源ノ角ゴシック'"; //停留所名のフォント、二重のクオーテーションマークに注意
    public stop_color_standard:string ="#000000"; //通常の停留所記号の色
    public stop_color_nonstandard:string ="#FFFFFF"; //起終点等の停留所記号の色
    public stop_color_location:string ="#C0C0C0"; //位置を示す停留所記号の色
    public stop_stroke_color:string ="#000000"; //停留所記号の縁の色
    public stop_stroke_width:number =1; //停留所記号の縁の太さ
    public show_stop_location:boolean =true; //停留所位置の記号を表示
    public stop_direction:boolean =true; //停留所記号を三角形にして向きを明示
    public min_space_width:number =2; //線の間隔の最小幅
    public min_width:number =4; //線の最小幅
    public max_width:number =8; //線の最大幅
    public round:boolean =true //; //角を丸める
}
