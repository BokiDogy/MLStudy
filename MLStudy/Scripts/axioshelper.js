/**数据转换成地址字符
 * @param {Object} datas 数据的json格式
 */
function str(datas) {
	let str = '1=1';
	for(k in datas) {
		str = str + '&' + k + '=' + datas[k];
	}
	return str;
}
/**
 * post方式头文字
 */
function headers() {
	return {
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	};
}
//将对象解析成key=value
function getDataUrl(obj) {
	let date = new Date();
	let str = '?timer=' + date.getTime();
	for(let n in obj) {
		str += '&' + n + '=' + obj[n];
	}
	return str;
}