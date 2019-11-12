//初期設定
import {InputSetting} from "./a_hanyou";

export function f_input_settings(a_settings:InputSetting) {
	//初期値の設定はこの関数の前で設定する。

	//設定の制限（暫定的に連動）
	if (a_settings["global"] === true) {
		a_settings["change"] = true;
		a_settings["leaflet"] = true;
		a_settings["clickable"] = true;
		a_settings["timetable"] = true;
	}
	//設定の制限
	//グローバルにしないと後から変えられない
	if (a_settings["global"] !== true) {
		a_settings["change"] = false;
		a_settings["leaflet"] = false;
		a_settings["clickable"] = false;
		a_settings["timetable"] = false;
	}
	//設定の制限
	//クリックできないと時刻表を表示できない
	if (a_settings["clickable"] !== true) {
		a_settings["timetable"] = false;
	}
	//設定の互換性
	if (a_settings["svg_zoom_ratio"] === undefined) {
		if (a_settings["svg_zoom_level"] === 1614) {
			a_settings["svg_zoom_ratio"] = 2;
		} else {
			a_settings["svg_zoom_ratio"] = 0;
		}
	}
	return a_settings;
}

