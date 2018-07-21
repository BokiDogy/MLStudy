//用法:
//参数c1,c2,c3代表设置的三个颜色的十六位代码,如黑色为'000000',白色为'FFFFFF',注意不要带'#'号
//count为渐变分割份数
//返回值为一个字符串数组,每个元素为一个颜色代码
//示例:
//使用函数:colors = colorChange("FF006C", "FDF003", "01A3EE", t.length);
//'faff72','f47983','ffffff' 红
//"ffa631", "fff143","ffffff" 黄
//"40de5a","3de1ad","ffffff" 绿
//"c0ebd7","f0fcff","ffffff" 白
//"3399CC", "CCFFFF","FFFFFF" 蓝
//colors为返回的颜色代码字符串数组
//设定颜色时示例:
//color: colors[i];

//三色渐变色算法--中间突变
function colorChange(c1, c2, c3, count) {
	let a = hexToRgb(c1);
	let b = hexToRgb(c2);
	let c = hexToRgb(c3);
	let colors = [];
	for (let i = 0; i < parseInt(count / 2); i++) {
		let stepr1 = (a[0] - b[0]) / parseInt(count / 2);
		let stepg1 = (a[1] - b[1]) / parseInt(count / 2);
		let stepb1 = (a[2] - b[2]) / parseInt(count / 2);
		let numr1 = b[0] + stepr1 * i;
		let numg1 = b[1] + stepg1 * i;
		let numb1 = b[2] + stepb1 * i;
		colors.push(rgbToHex(numr1, numg1, numb1));
	}
	for (let j = 0; j <= parseInt(count / 2); j++) {
		let stepr2 = (b[0] - c[0]) / parseInt(count / 2);
		let stepg2 = (b[1] - c[1]) / parseInt(count / 2);
		let stepb2 = (b[2] - c[2]) / parseInt(count / 2);
		let numr2 = c[0] + stepr2 * j;
		let numg2 = c[1] + stepg2 * j;
		let numb2 = c[2] + stepb2 * j;
		colors.push(rgbToHex(numr2, numg2, numb2));
	}
	return colors;
}

//三色渐变色算法--渐变
function colorChange2(c1, c2, c3, count) {
	let a = hexToRgb(c1);
	let b = hexToRgb(c2);
	let c = hexToRgb(c3);
	let colors = [];
	for (let i = 0; i < parseInt(count / 2); i++) {
		let stepr1 = (b[0] - a[0]) / parseInt(count / 2);
		let stepg1 = (b[1] - a[1]) / parseInt(count / 2);
		let stepb1 = (b[2] - a[2]) / parseInt(count / 2);
		let numr1 = a[0] + stepr1 * i;
		let numg1 = a[1] + stepg1 * i;
		let numb1 = a[2] + stepb1 * i;
		colors.push(rgbToHex(numr1, numg1, numb1));
	}
	for (let j = 0; j <= parseInt(count / 2); j++) {
		let stepr2 = (c[0] - b[0]) / parseInt(count / 2);
		let stepg2 = (c[1] - b[1]) / parseInt(count / 2);
		let stepb2 = (c[2] - b[2]) / parseInt(count / 2);
		let numr2 = b[0] + stepr2 * j;
		let numg2 = b[1] + stepg2 * j;
		let numb2 = b[2] + stepb2 * j;
		colors.push(rgbToHex(numr2, numg2, numb2));
	}
	return colors;
}

//计算对比色
function getComplycolor(hex) {
	let hsl = hex2hsl(hex);
	let result = {
		h: parseInt((hsl.h - 120) % 360),
		//		l: 1 - hsl.l,
		l: hsl.l > 0.5 ? ((1 - hsl.l) / 2) : (1 - hsl.l / 2),
		//l: Math.abs(hsl.l - 0.5) < 0.02 ? (Math.abs(hsl.l - 0.5)) : (hsl.l>0.5?(( 1 - hsl.l)/2):(1-hsl.l/2)),
		//		s: hsl.s
		s: 1
	}
	return hsl2hex(result);
}
//计算互补色
function getHucaise(hex) {
	let hsl = hex2hsl(hex);
	let result = {
		h: parseInt((hsl.h + 180) % 360),
		//		l: 1 - hsl.l,
		l: hsl.l > 0.5 ? ((1 - hsl.l) / 2) : (1 - hsl.l / 2),
		s: hsl.s
	}
	return hsl2hex(result);
}

//十六进制转rgb
function hexToRgb(hex) {
	let rgb = [];
	if (hex.indexOf("#") >= 0) {
		hex = hex.substring(hex.indexOf("#") + 1);
	}
	for (let i = 0; i < 6; i += 2) {
		rgb.push(parseInt(hex.substr(i, 2), 16));
	}
	return rgb;
}
//rgb转十六进制
function rgbToHex(r, g, b) {
	let hex = ((r << 16) | (g << 8) | b).toString(16);
	return "#" + new Array(Math.abs(hex.length - 7)).join("0") + hex;
}

function hex2hsl(hex) {
	let rgbs = hexToRgb(hex);
	let rgb = {
		r: rgbs[0],
		g: rgbs[1],
		b: rgbs[2]
	};
	let hsl = rgbToHsl(rgb.r, rgb.b, rgb.b);
	return hsl;
}

function hsl2hex(hsl) {
	let rgb = hslToRgb(hsl.h, hsl.s, hsl.l);
	let hex = rgbToHex(rgb.r, rgb.g, rgb.b);
	return hex;
}

/**
 * RGB 颜色值转换为 HSL.
 * 转换公式参考自 http://en.wikipedia.org/wiki/HSL_color_space.
 * r, g, 和 b 需要在 [0, 255] 范围内
 * 返回的 h, s, 和 l 在 [0, 1] 之间
 *
 * @param   Number  r       红色色值
 * @param   Number  g       绿色色值
 * @param   Number  b       蓝色色值
 * @return  Array           HSL各值数组
 */
function rgbToHsl(r, g, b) {
	r /= 255, g /= 255, b /= 255;
	var max = Math.max(r, g, b),
		min = Math.min(r, g, b);
	var h, s, l = (max + min) / 2;

	if (max == min) {
		h = s = 0; // achromatic
	} else {
		var d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		switch (max) {
			case r:
				h = (g - b) / d + (g < b ? 6 : 0);
				break;
			case g:
				h = (b - r) / d + 2;
				break;
			case b:
				h = (r - g) / d + 4;
				break;
		}
		h /= 6;
	}
	let hsl = {
		h: h * 360,
		s: s,
		l: l
	}
	return hsl;
}

/**
 * HSL颜色值转换为RGB. 
 * 换算公式改编自 http://en.wikipedia.org/wiki/HSL_color_space.
 * h, s, 和 l 设定在 [0, 1] 之间
 * 返回的 r, g, 和 b 在 [0, 255]之间
 *
 * @param   Number  h       色相
 * @param   Number  s       饱和度
 * @param   Number  l       亮度
 * @return  Array           RGB色值数值
 */
function hslToRgb(h, s, l) {
	h /= 360;
	var r, g, b;

	if (s == 0) {
		r = g = b = l; // achromatic
	} else {
		var hue2rgb = function hue2rgb(p, q, t) {
			if (t < 0) t += 1;
			if (t > 1) t -= 1;
			if (t < 1 / 6) return p + (q - p) * 6 * t;
			if (t < 1 / 2) return q;
			if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
			return p;
		}

		var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		var p = 2 * l - q;
		r = hue2rgb(p, q, h + 1 / 3);
		g = hue2rgb(p, q, h);
		b = hue2rgb(p, q, h - 1 / 3);
	}
	let result = {
		r: Math.round(r * 255),
		g: Math.round(g * 255),
		b: Math.round(b * 255)
	};
	return result;
}



// padLeft 函数实现
String.prototype.padLeft = Number.prototype.padLeft = function (length, char) {
	var reg = /^[0-9]+$/;
	if (!reg.test(length)) return this;

	length = parseInt(length);
	char = (char == null || (typeof char === 'undefined')) ? ' ' : String(char);
	var _s = String(this);
	var _len = _s.length;
	var padLen = length - _len;
	if (padLen <= 0) return this;
	for (var i = 0; i < padLen; i++) {
		_s = char + _s;
	}
	return _s;
}
// padRight 函数实现
String.prototype.padRight = Number.prototype.padRight = function (length, char) {
	var reg = /^[0-9]+$/;
	if (!reg.test(length)) return this;

	length = parseInt(length);
	char = (char == null || (typeof char === 'undefined')) ? ' ' : String(char);
	var _s = String(this);
	var _len = _s.length;
	var padLen = length - _len;
	if (padLen <= 0) return this;
	for (var i = 0; i < padLen; i++) {
		_s += char;
	}
	return _s;
}

//date格式化
Date.prototype.Format = function (fmt) { //author: meizz
	var o = {
		"M+": this.getMonth() + 1, //月份
		"d+": this.getDate(), //日
		"h+": this.getHours(), //小时
		"m+": this.getMinutes(), //分
		"s+": this.getSeconds(), //秒
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度
		"S": this.getMilliseconds() //毫秒
	};
	if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}