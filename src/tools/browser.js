export function isIe() {
	const ua = window.navigator.userAgent;
	const msie = ua.indexOf('MSIE ');
	if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv:11\./)) return true;
	return false;
}

export function isEdge() {
	if (/Edge\/\d./i.test(navigator.userAgent)) {
		return true;
	}

	return false;
}

export function isSafari() {
	if (navigator.userAgent.match(/Version\/[\d.]+.*Safari/)) return true;
	return false;
}

export function isFirefox() {
	if (typeof InstallTrigger !== 'undefined') return true;
	return false;
}

export function isOpera() {
	if (
		(!!window.opr && !!window.opr.addons) ||
		!!window.opera ||
		navigator.userAgent.indexOf(' OPR/') >= 0
	)
		return true;
	return false;
}

export function isChrome() {
	const isChromium = window.chrome;
	const winNav = window.navigator;
	const vendorName = winNav.vendor;
	const isIEedge = winNav.userAgent.indexOf('Edge') > -1;

	if (
		isChromium !== null &&
		typeof isChromium !== 'undefined' &&
		vendorName === 'Google Inc.' &&
		isOpera() === false &&
		isIEedge === false
	)
		return true;
	return false;
}

export function isIOS() {
	if (!!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform)) return true;
	return false;
}

export function isIOSChrome() {
	if (navigator.userAgent.match('CriOS')) return true;
	return false;
}

export function isIOSFirefox() {
	if (navigator.userAgent.match('FxiOS')) return true;
	return false;
}

export function isAndroid() {
	if (navigator.userAgent.toLowerCase().indexOf('android') > -1) return true;
	return false;
}
