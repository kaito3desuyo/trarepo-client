
/*
曲線
停留所間ごとの分割
注意：左手系
*/




import {CrossPont, Offset, Point3, Segment} from "./a_hanyou";
import {Point} from "leaflet";

export function f_offset_segment_array(input:Segment[]) {
	let segmentList = input;
	f_offset_3(segmentList); //初回計算
	let l_exist = false; //逆の順序が存在するときtrue、しないと仮定
	let l_sids = []; //統合する点のidたち（始点側）
	while (0 < segmentList.length) { //無限ループ注意
		l_exist = false;
		l_sids = [];
		const c_segments_2 = []; //残すsegment
		for (let i2 = 0; i2 < segmentList.length; i2++) {
			//統合する点のidをまとめる。
			for (let i3 = 0; i3 < segmentList[i2].sids.length; i3++) {
				l_sids.push(segmentList[i2].sids[i3]);
			}
			if ((0 < i2) && (i2 < segmentList.length - 1) //最初と最後は残すので除く
				&& (segmentList[i2].st > segmentList[i2].et) //順序が逆
				&& (segmentList[i2]["sn"] === false && segmentList[i2]["en"] === false) //残す指定なし
			) { //逆の順序の場合
				l_exist = true; //逆の順序が存在
			} else {
				c_segments_2.push(segmentList[i2]);
				if (i2 !== 0) {
					c_segments_2[c_segments_2.length - 2].eids = l_sids;
				}
				c_segments_2[c_segments_2.length - 1].sids = l_sids;
				if (i2 === segmentList.length - 1) {
					c_segments_2[c_segments_2.length - 1].eids = segmentList[i2].eids;
				}
				l_sids = [];
			}
		}
		segmentList = c_segments_2; //代入して変える
		f_offset_3(segmentList); //再計算
		if (l_exist === false) { //逆の順序が存在しなければ終了する。
			break;
		}
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
	const c_segment_pair_key = "segment_pair_key_" + String(segment1.sx) + "_" + String(segment1.sy) + "_" + String(segment1.ex) + "_" + String(segment1.ey) + "_" + String(segment2.sx) + "_" + String(segment2.sy) + "_" + String(segment2.ex) + "_" + String(segment2.ey);
	
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
	for (let i1 = 0; i1 < c_z["xy"].length; i1++) {
		c_xy.push(new Point( c_s1z * c_z["xy"][i1].x[0] + c_s2z * c_z["xy"][i1].x[1] + c_z["xy"][i1].x[2], c_s1z * c_z["xy"][i1].y[0] + c_s2z * c_z["xy"][i1].y[1] + c_z["xy"][i1].y[2]));
	}
	segment1.exy = c_xy;
	segment2.sxy = c_xy;
}





//2つの有向線分の始点と終点を入力する
//折れ点、折れ点の線分上における相対的な位置を出力する（有向線分1と有向線分2のオフセット幅の函数になる）
//有向線分1のずらし幅をz1、有向線分2のずらし幅をz2とすると、出力は a × z1 + b × z2 + c の形になる。この[a, b, c]を出力すればよい。

function f_offset(segment1:Segment, segment2:Segment) :Offset{
	let l_parallel = false;
	const c_p1x = segment1.sx;
	const c_p1y = segment1.sy;
	const c_p2x = segment1.ex;
	const c_p2y = segment1.ey;
	const c_p3x = segment2.sx;
	const c_p3y = segment2.sy;
	const c_p4x = segment2.ex;
	const c_p4y = segment2.ey;
	//有向線分がなすベクトルのx成分とy成分と大きさ（ユークリッドノルム）を計算する
	const c_v1x = c_p2x - c_p1x;
	const c_v1y = c_p2y - c_p1y;
	const c_v1n = ((c_v1x * c_v1x) + (c_v1y * c_v1y)) ** 0.5;
	const c_v2x = c_p4x - c_p3x;
	const c_v2y = c_p4y - c_p3y;
	const c_v2n = ((c_v2x * c_v2x) + (c_v2y * c_v2y)) ** 0.5;
	//正弦と余弦？も計算する
	//左手系に注意？
	const c_v1xn = (-1) * c_v1x / c_v1n;
	const c_v1yn = c_v1y / c_v1n;
	const c_v2xn = (-1) * c_v2x / c_v2n;
	const c_v2yn = c_v2y / c_v2n;
	
	//少なくとも1つが点だとうまくいかないので確認する
	if ((c_p1x === c_p2x && c_p1y === c_p2y) || (c_p3x === c_p4x && c_p3y === c_p4y)) {
		console.log("点あり");
	}
	//2つの有向線分が同一だとうまくいかないので確認する（向きが逆ならよい）
	if (c_p1x === c_p3x && c_p1y === c_p3y && c_p2x === c_p4x && c_p2y === c_p4y) {
		console.log("同一");
	}
	//平行を確認する
	if ((c_p2x - c_p1x) * (c_p4y - c_p3y) === (c_p2y - c_p1y) * (c_p4x - c_p3x)) {
		console.log("平行");
		l_parallel = true;
	}
	
	//交点を求める
	let l_pc;
	if (l_parallel === false) { //平行でないとき（交点あり）
		l_pc = f_cross_point(c_p1x, c_p1y, c_p2x, c_p2y, c_p3x, c_p3y, c_p4x, c_p4y);
	} else { //平行なとき（交点なし、p2とp3の中点をとる）
		l_pc = {"x": (c_p2x + c_p3x) * 0.5, "y": (c_p2y + c_p3y) * 0.5};
	}
	const c_pcx = l_pc.x;
	const c_pcy = l_pc.y;
	
	//各有向線分に対する交点の相対的な位置
	//有向線分1の始点p1を-1、終点p2を0としたときの交点の位置
	// const c_d1x = c_pcx - c_p2x;
	// const c_d1y = c_pcy - c_p2y;
	let l_d1t;
	if (c_p2x !== c_p1x) { //y軸に平行でない
		l_d1t = (c_pcx - c_p2x) / (c_p2x - c_p1x);
	} else if (c_p2y !== c_p1y) { //x軸に平行でない
		l_d1t = (c_pcy - c_p2y) / (c_p2y - c_p1y);
	} else {
		console.log("？");
	}
	//有向線分2の始点p3を0、終点p4を1としたときの交点の位置
	// const c_d2x = c_pcx - c_p3x;
	// const c_d2y = c_pcy - c_p3y;
	let l_d2t;
	if (c_p4x !== c_p4x) { //y軸に平行でない
		l_d2t = (c_pcx - c_p3x) / (c_p4x - c_p3x);
	} else if (c_p4y !== c_p3y) { //x軸に平行でない
		l_d2t = (c_pcy - c_p3y) / (c_p4y - c_p3y);
	} else {
		console.log("？");
	}
	
	if (c_v1n < 0.01 || c_v2n < 0.01) { ////大きさが十分小さいとき
		//console.log("大きさが小さいので注意"); //例外処置、未完成
	}
	
	const c_xxyy = c_v1x * c_v2x + c_v1y * c_v2y;
	const c_xyxy= c_v1x * c_v2y - c_v2x * c_v1y; //平行のとき0
	const c_xyxynn = c_xyxy / (c_v1n * c_v2n); //大きさをそろえる
	const c_yxyx = 1 / c_xyxy;
	
	//d1tはずらし幅z1、z2のとき、z1 * d1t[0] + z2 * d1t[1] + d1t[2]の値
	
	if (Math.abs(c_xyxynn) < 0.1) { //平行に近い
		const offset=new Offset();
		offset.d1t=[0, 0, 1];
		offset.d2t=[0, 0, 0];
		offset.xy.push(new Point3([c_v1yn, 0, c_p2x],[c_v1xn, 0, c_p2y]));
		offset.xy.push(new Point3([c_v1yn * 0.5, c_v2yn * 0.5, (c_p2x + c_p3x) * 0.5],[c_v1xn * 0.5, c_v2xn * 0.5, (c_p2y + c_p3y) * 0.5]));
		offset.xy.push(new Point3([0, c_v2yn, c_p3x],[0, c_v2xn, c_p3y]));
		return offset;
	}
	//p2とp3が同じで、折り返し（p1とp4が同じ）の場合は角を丸めたいが、場合分けを省略
	//p2とp3が同じで、標柱で切断した点の場合、場合分けを省略
	//p2とp3が同じで、オフセット幅が同じなら1点で曲げたいが、場合分けを省略
	//p2とp3が同じ場合、場合分けを省略
	const offset=new Offset();
	offset.d1t= [(-1) * c_yxyx * c_xxyy / c_v1n, c_yxyx * c_v2n, 1 + l_d1t];
	offset.d2t= [(-1) * c_yxyx * c_v1n, c_yxyx * c_xxyy / c_v2n, l_d2t];
	offset.xy.push(new Point3([(-1) * c_v1n * c_v2x * c_yxyx, c_v2n * c_v1x * c_yxyx, c_pcx], [(-1) * c_v1n * c_v2y * c_yxyx, c_v2n * c_v1y * c_yxyx, c_pcy]));
	return offset;
	
	//曲線機能は停止
	
}



function f_cross_point(a_x1:number, a_y1:number, a_x2:number, a_y2:number, a_x3:number, a_y3:number, a_x4:number, a_y4:number):CrossPont{
	const c_vy1 = a_y2 - a_y1;
	const c_vx1 = a_x1 - a_x2;
	const c_1 = -1 * c_vy1 * a_x1 - c_vx1 * a_y1;
	const c_vy2 = a_y4 - a_y3;
	const c_vx2 = a_x3 - a_x4;
	const c_2 = -1 * c_vy2 * a_x3 - c_vx2 * a_y3;
	
	const c_3 = c_vx1 * c_vy2 - c_vx2 * c_vy1;
	if(c_3 === 0){ //平行によりうまく求められないとき。
		const result=new CrossPont();
		result.x=(a_x2 + a_x3) * 0.5;
		result.y=(a_y2 + a_y3) * 0.5;
		result.parallel=true;
		return result;
	} else {
		const result=new CrossPont();
		result.x= (c_1 * c_vx2 - c_2 * c_vx1) / c_3;
		result.y=(c_vy1 * c_2 - c_vy2 * c_1) / c_3;
		result.parallel=false;
		return result;
	}
}
