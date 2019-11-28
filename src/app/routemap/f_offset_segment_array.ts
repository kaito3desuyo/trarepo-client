
/*
曲線
停留所間ごとの分割
注意：左手系
*/




import {Offset, Point3, Segment} from "./a_hanyou";
import {Point} from "leaflet";
import {RouteMAP} from "./busmap";
import Route = RouteMAP.Route;

export function f_offset_segment_array(route:Route) {
	try{
	let segmentList = route.segmentList;
	f_offset_3(segmentList); //初回計算
	let l_exist = false; //逆の順序が存在するときtrue、しないと仮定
	let l_sids:string =undefined; //統合する点のidたち（始点側）
	while (0 < segmentList.length) { //無限ループ注意
		l_exist = false;
		l_sids = undefined;
		const c_segments_2:Segment[] = []; //残すsegment
		for (let i2 = 0; i2 < segmentList.length; i2++) {
			l_sids=segmentList[i2].sid;
			if ((0 < i2) && (i2 < segmentList.length - 1) //最初と最後は残すので除く
				&& (segmentList[i2].st > segmentList[i2].et) //順序が逆
				&& (segmentList[i2]["sn"] === false && segmentList[i2]["en"] === false) //残す指定なし
			) { //逆の順序の場合
				l_exist = true; //逆の順序が存在
			} else {
				c_segments_2.push(segmentList[i2]);
				if (i2 !== 0) {
					c_segments_2[c_segments_2.length - 2].eid = l_sids;
				}
				c_segments_2[c_segments_2.length - 1].sid = l_sids;
				if (i2 === segmentList.length - 1) {
					c_segments_2[c_segments_2.length - 1].eid = segmentList[i2].eid;
				}
				l_sids =undefined ;
			}
		}
		segmentList = c_segments_2; //代入して変える
		f_offset_3(segmentList); //再計算
		if (l_exist === false) { //逆の順序が存在しなければ終了する。
			break;
		}

	}
	}catch (e) {
		console.log(e);
		console.log(route);
	}
	
}



function f_offset_3(segmentList:Segment[]) {
	//始点
	segmentList[0].st = 0;
	const c_v0z = segmentList[0].z;
	const c_v0x = segmentList[0].ex - segmentList[0].sx;
	const c_v0y = segmentList[0].ey - segmentList[0].sy;
	const c_v0n = ((c_v0x * c_v0x) + (c_v0y * c_v0y)) ** 0.5;
	segmentList[0].sxy = [new Point(c_v0z * c_v0y / c_v0n + segmentList[0].sx,(-1) * c_v0z * c_v0x / c_v0n + segmentList[0].sy)];
	//終点
	segmentList[segmentList.length - 1].et = 1;
	const c_vnz = segmentList[segmentList.length - 1].z;
	const c_vnx = segmentList[segmentList.length - 1].ex - segmentList[segmentList.length - 1].sx;
	const c_vny = segmentList[segmentList.length - 1].ey - segmentList[segmentList.length - 1].sy;
	const c_vnn = ((c_vnx * c_vnx) + (c_vny * c_vny)) ** 0.5;
	segmentList[segmentList.length - 1].exy = [new Point(c_vnz * c_vny / c_vnn + segmentList[segmentList.length - 1].ex, (-1) * c_vnz * c_vnx / c_vnn + segmentList[segmentList.length - 1].ey)];
	//途中
	for (let i1 = 0; i1 < segmentList.length - 1; i1++) {
		f_offset_2(segmentList[i1], segmentList[i1 + 1]);
	}
}




function f_offset_2(segment1:Segment, segment2:Segment) {
//	const c_segment_pair_key = "segment_pair_key_" + String(segment1.sx) + "_" + String(segment1.sy) + "_" + String(segment1.ex) + "_" + String(segment1.ey) + "_" + String(segment2.sx) + "_" + String(segment2.sy) + "_" + String(segment2.ex) + "_" + String(segment2.ey);
	
	/*
	if (c_segment_pairs[c_segment_pair_key] === undefined) {
		c_segment_pairs[c_segment_pair_key] = f_offset(c_s1, c_s2);
	}
	const c_z = c_segment_pairs[c_segment_pair_key];
	*/
	const c_z:Offset = f_offset(segment1, segment2);
	
	
	//ずらし幅
	const c_s1z = segment1.z;
	const c_s2z = segment2.z;
	 segment1.et = c_s1z * c_z.d1t[0] + c_s2z * c_z.d1t[1] + c_z.d1t[2];
	 segment2.st = c_s1z * c_z.d2t[0] + c_s2z * c_z.d2t[1] + c_z.d2t[2];
	
	//以下は後でまとめてもよい？
	const c_xy :Point[]= [];
	//kamelong変更部分　c_xyに最初の要素しか入れない
	// for (let i1 = 0; i1 < c_z.xy.length; i1++) {
	// 	c_xy.push(new Point( c_s1z * c_z.xy[i1].x[0] + c_s2z * c_z.xy[i1].x[1] + c_z.xy[i1].x[2], c_s1z * c_z.xy[i1].y[0] + c_s2z * c_z.xy[i1].y[1] + c_z.xy[i1].y[2]));
	// }
	for (let i1 = 0; i1 < 1; i1++) {
		 c_xy.push(new Point( c_s1z * c_z.xy[i1].x[0] + c_s2z * c_z.xy[i1].x[1] + c_z.xy[i1].x[2], c_s1z * c_z.xy[i1].y[0] + c_s2z * c_z.xy[i1].y[1] + c_z.xy[i1].y[2]));
	}
	// segment1.exy = c_xy;
	// segment2.sxy = c_xy;
	segment1.exy =c_xy;
	segment2.sxy = c_xy;
}





//2つの有向線分の始点と終点を入力する
//折れ点、折れ点の線分上における相対的な位置を出力する（有向線分1と有向線分2のオフセット幅の函数になる）
//有向線分1のずらし幅をz1、有向線分2のずらし幅をz2とすると、出力は a × z1 + b × z2 + c の形になる。この[a, b, c]を出力すればよい。

function f_offset(segment1:Segment, segment2:Segment) :Offset{
	const p11x = segment1.sx;
	const p11y = segment1.sy;
	const p12x = segment1.ex;
	const p12y = segment1.ey;
	const p21x = segment2.sx;
	const p21y = segment2.sy;
	const p22x = segment2.ex;
	const p22y = segment2.ey;
	//有向線分がなすベクトルのx成分とy成分と大きさ（ユークリッドノルム）を計算する
	const v1x = p12x - p11x;
	const v1y = p12y - p11y;
	const v1r = ((v1x * v1x) + (v1y * v1y)) ** 0.5;
	const v2x = p22x - p21x;
	const v2y = p22y - p21y;
	const v2r = ((v2x * v2x) + (v2y * v2y)) ** 0.5;


	//無理やり路線を平行にする必要はないのでオフセット幅は適当に
	const offset=new Offset();

	offset.d1t=[0, 0, 1];
	offset.d2t=[0, 0, 0];
	const a=1/(v1r)+1/v2r;

	offset.xy.push(new Point3([ v1y/v1r/v1r/a, v2y/v2r/v2r/a, (p12x + p21x) * 0.5], [-v1x/v1r/v1r/a,-v2x/v2r/v2r/a,(p12y + p21y) * 0.5]));
	return offset;

}

