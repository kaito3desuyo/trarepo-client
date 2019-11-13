//"use strict";
//これ以外に読み込みが必要なもの
//leaflet
import {f_xhr_get, KLAPI} from "./f_xhr_get.js";
import {f_lon_to_x, f_lat_to_y, f_x_to_lon, f_y_to_lat} from "./lonlat_xy.js";
import {f_offset_segment_array} from "./f_offset_segment_array.js";
import * as L from "leaflet";
import {Point2, PolyLine, Segment, SegmentList, StationXY, SubSegment} from "./a_hanyou";
import {LatLng, Point} from "leaflet";
export async function f_busmap() {
	const c_zoom_level = 10; //初期ズームレベル
	//leaflet
//	document.getElementById("div_leaflet").style.height = "512px";
	let l_map = L.map("div_leaflet"); //leafletの読み込み。
	L.tileLayer("https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png", {attribution: "<a href=\"https://maps.gsi.go.jp/development/ichiran.html\">地理院タイル</a>", opacity: 0.25}).addTo(l_map); //背景地図（地理院地図等）を表示する。
	L.svg().addTo(l_map); //svg地図を入れる。
	l_map.setView([36, 135], 10); //初期表示位置
	//データ読み込み
	// const klAPI:KLAPI = await f_xhr_get("https://kamelong.com/nodeJS/api?minLat=34&maxLat=36&minLon=135&maxLon=136&zoomLevel=10", "json");
	const klAPI:KLAPI = await f_xhr_get("https://kamelong.com/nodeJS/api?minLat=20&maxLat=50&minLon=120&maxLon=150&zoomLevel=10", "json");

	//色々調整
	f_offset_polyline(klAPI,f_zoom_ratio(c_zoom_level));

	//leafletで表示
	//線
	for (let routeID in klAPI.route) {
		klAPI.route[routeID].l_polyline = L.polyline(klAPI.route[routeID].polyline, {"color": klAPI.route[routeID].color, "weight": 5, opacity: 0.5}).addTo(l_map);
	}
	//駅
	for (let i1 in klAPI.route) {
		klAPI.route[i1].l_points = [];
		for (let i2 = 0; i2 < klAPI.route[i1].points.length; i2++) {
			klAPI.route[i1].l_points.push(L.circleMarker(klAPI.route[i1].points[i2]["latlon"], {"color": "#000000", "fillColor": "#c0c0c0", "fillOpacity": 1, "radius": 2.5, "weight": 0.5, "opacity": 1}).addTo(l_map));
		}
	}
	//駅名
	for (let i1 in klAPI.station) {
		// L.marker([klAPI.station[i1].lat, klAPI.station[i1].lon], {"icon": L.divIcon({"html": klAPI.station[i1]["name"], className: "className", iconSize: [256, 16], iconAnchor: [-4, -4]})}).addTo(l_map);
	}
	f_zoom();


	
	//zoomlevelに応じてオフセット幅の倍率を自動で変える
	//ズームレベル変更→オフセット再計算→leaflet変更
	l_map.on("zoom", f_zoom);
	function f_zoom() {
		f_offset_polyline(klAPI, f_zoom_ratio(l_map.getZoom()));
		//線
		for (let i1 in klAPI.route) {
			klAPI.route[i1].l_polyline.setLatLngs(klAPI.route[i1].polyline);
		}
		//駅
		for (let i1 in klAPI.route) {
			for (let i2 = 0; i2 < klAPI.route[i1].points.length; i2++) {
				klAPI.route[i1].l_points[i2].setLatLng(klAPI.route[i1].points[i2]["latlon"]);
			}
		}
	}
	
	//ズームレベルに応じたオフセット幅の倍率
	function f_zoom_ratio(a_zoom_level:number) {
		return 12*1.5**(20-a_zoom_level); //オフセット幅の調節
	}
	
}

function f_offset_polyline(a_data:KLAPI, a_zoom_ratio:number) { //a_zoom_ratioは今のところ無効
	//緯度経度をxy（仮にEPSG:3857）に変換しておく
	const c_station_xy :{[key:string]:StationXY}= {};
	for (let i1 in a_data.station) {
		c_station_xy[i1] = new StationXY();
		c_station_xy[i1].x = f_lon_to_x(a_data.station[i1].lon, null);
		c_station_xy[i1].y = f_lat_to_y(a_data.station[i1].lat, null);
	}
	//折れ線の線分の列c_segment_arraysを作る
	//keyはrouteID
	const c_segment_arrays :{[key:string]:Segment[]}= {};
	for (let i1 in a_data.route) {
		c_segment_arrays[i1] = [];
		for (let i2 = 0; i2 < a_data.route[i1].stationList.length - 1; i2++) {
			const c_sid = a_data.route[i1].stationList[i2];
			const c_eid = a_data.route[i1].stationList[i2 + 1];
			const segment=new Segment();
			segment.sid=c_sid;
			segment.eid=c_eid;
			// segment.sids=[c_sid];
			// segment.eids=[c_eid];
			segment.sx=c_station_xy[c_sid].x;
			segment.sy=c_station_xy[c_sid].y;
			segment.ex=c_station_xy[c_eid].x;
			segment.ey=c_station_xy[c_eid].y;
			segment.sn=true;
			segment.en=true;
			segment.w=null;
			segment.z=null;
			c_segment_arrays[i1].push(segment);
		}
	}
	
	//線分をc_segmentsに集める
	//keyはsegmentのsidとeidの組み合わせ
	const c_segments:{[key:string]:SegmentList} = {};
	for (let i1 in c_segment_arrays) {
		for (let i2 = 0; i2 < c_segment_arrays[i1].length; i2++) {
			const c_segment = c_segment_arrays[i1][i2];
			const c_segment_key_1 = "segment_" + c_segment.sid + "_" + c_segment.eid;
			const c_segment_key_2 = "segment_" + c_segment.eid + "_" + c_segment.sid;
			if (c_segments[c_segment_key_1] !== undefined) {
				const subSegment=new SubSegment();
				subSegment.id=i1;
				subSegment.direction=1;
				subSegment.w=1;
				subSegment.z=null;
				c_segments[c_segment_key_1].segments[i1]=subSegment;
				c_segments[c_segment_key_1].number += 1;
			} else if (c_segments[c_segment_key_2] !== undefined) {
				const subSegment=new SubSegment();
				subSegment.id=i1;
				subSegment.direction=-1;
				subSegment.w=1;
				subSegment.z=null;
				c_segments[c_segment_key_2].segments[i1]=subSegment;
				c_segments[c_segment_key_2].number += 1;
			} else {
				const segmentList=new SegmentList();
				segmentList.number=1;
				const subSegment=new SubSegment();
				subSegment.id=i1;
				subSegment.direction=1;
				subSegment.w=1;
				subSegment.z=null;
				segmentList.segments[subSegment.id]=subSegment;
				c_segments[c_segment_key_1]=segmentList;
			}
		}
	}
	//オフセット幅zを設定
	for (let segSetKey in c_segments) {
		let l_z = (-1) * (c_segments[segSetKey].number - 1) * 0.5;
		for (let i2 in c_segments[segSetKey].segments) {
			if (i2 !== "number") {
				if (c_segments[segSetKey].segments[i2].direction === 1) {
					c_segments[segSetKey].segments[i2].z = l_z * a_zoom_ratio;
				} else if (c_segments[segSetKey].segments[i2].direction === -1) {
					c_segments[segSetKey].segments[i2].z = (-1) * l_z * a_zoom_ratio;
				}
				l_z += 1;
			}
		}
	}
	
	//オフセット幅zをc_segment_arraysに入れる
	for (let routeID in c_segment_arrays) {
		for (let segmentIndex = 0; segmentIndex < c_segment_arrays[routeID].length; segmentIndex++) {
			const c_segment:Segment = c_segment_arrays[routeID][segmentIndex];
			const c_segment_key_1 = "segment_" + c_segment.sid + "_" + c_segment.eid;
			const c_segment_key_2 = "segment_" + c_segment.eid + "_" + c_segment.sid;
			if (c_segments[c_segment_key_1] !== undefined) {
				if (c_segments[c_segment_key_1].segments[routeID] !== undefined) {
					c_segment.z = c_segments[c_segment_key_1].segments[routeID].z;
				} else if (c_segments[c_segment_key_2].segments[routeID] !== undefined) {
					c_segment.z = c_segments[c_segment_key_2].segments[routeID].z;
				}
			} else {
				c_segment.z = c_segments[c_segment_key_2].segments[routeID].z;
			}
			
		}
	}
	//オフセットした線を作る
	const c_polylines :{[key:string]:PolyLine[]}= {};
	for (let routeID in c_segment_arrays) {
		f_offset_segment_array(c_segment_arrays[routeID]);
		//折れ線に変換する
		c_polylines[routeID] = [];
		for (let i2 = 0; i2 < c_segment_arrays[routeID][0].sxy.length; i2++) {
			const polyLine=new PolyLine();
			polyLine.x= c_segment_arrays[routeID][0].sxy[i2].x;
			polyLine.y=  c_segment_arrays[routeID][0].sxy[i2].y;
			c_polylines[routeID].push(polyLine);
			if (c_segment_arrays[routeID][0].sxy.length === 3) {
				c_polylines[routeID][c_polylines[routeID].length - 2].ids = [c_segment_arrays[routeID][0].sid];
			} else {
				c_polylines[routeID][c_polylines[routeID].length - 1].ids = [c_segment_arrays[routeID][0].sid];
			}
		}
		for (let i2 = 0; i2 < c_segment_arrays[routeID].length; i2++) {

			for (let i3 = 0; i3 < c_segment_arrays[routeID][i2].exy.length; i3++) {
				const polyLine=new PolyLine();
				polyLine.x=  c_segment_arrays[routeID][i2].exy[i3].x;
				polyLine.y=   c_segment_arrays[routeID][i2].exy[i3].y;
				c_polylines[routeID].push(polyLine);
				if (c_segment_arrays[routeID][i2].exy.length === 3) {
					c_polylines[routeID][c_polylines[routeID].length - 2].ids = [c_segment_arrays[routeID][i2].eid];
				} else {
					c_polylines[routeID][c_polylines[routeID].length - 1].ids = [c_segment_arrays[routeID][i2].eid];
				}
			}
		}
		//xyを緯度経度に変換する
		for (let i2 = 0; i2 < c_polylines[routeID].length; i2++) {
			c_polylines[routeID][i2].lon = f_x_to_lon(c_polylines[routeID][i2].x,null);
			c_polylines[routeID][i2].lat = f_y_to_lat(c_polylines[routeID][i2].y,null);
		}


		//折れ線
		a_data.route[routeID].polyline = [];
		for (let i2 = 0; i2 < c_polylines[routeID].length; i2++) {
			const latlng=new LatLng(c_polylines[routeID][i2].lat,c_polylines[routeID][i2].lon);
			a_data.route[routeID].polyline.push(latlng);
		}
		//点
		a_data.route[routeID].points = [];
		for (let i2 = 0; i2 < c_polylines[routeID].length; i2++) {
			if (c_polylines[routeID][i2].ids !== undefined) {
				if (c_polylines[routeID][i2].ids.length === 1) { //各点idは1つだけの前提（統合していないはず）
					const point=new Point2();
					point.id=c_polylines[routeID][i2].ids[0];
					point.latlon=new LatLng(c_polylines[routeID][i2].lat,c_polylines[routeID][i2].lon);
					a_data.route[routeID].points.push(point);
				}
			}
		}
		
	}
}
