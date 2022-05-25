export function isIe(): boolean {
	const ua = window.navigator.userAgent;
	const msie = ua.indexOf('MSIE ');

	return msie > 0 || /Trident.*rv:11\./.test(navigator.userAgent);
}

export function isEdge(): boolean {
	return /Edge\/\d./i.test(navigator.userAgent);
}

export function isSafari(): boolean {
	return /Version\/[\d.]+.*Safari/.test(navigator.userAgent);
}

export function isFirefox(): boolean {
	return navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
}

export function isOpera(): boolean {
	const windowWithOpera = window as Window & { opr?: any; opera?: any };

	return (
		(!!windowWithOpera.opr && !!windowWithOpera.opr.addons) ||
		!!windowWithOpera.opera ||
		navigator.userAgent.indexOf(' OPR/') >= 0
	);
}

export function isChrome(): boolean {
	const isChromium = (window as any).chrome;
	const winNav = window.navigator;
	const vendorName = winNav.vendor;
	const isIEedge = winNav.userAgent.indexOf('Edge') > -1;

	return (
		isChromium !== null &&
		typeof isChromium !== 'undefined' &&
		vendorName === 'Google Inc.' &&
		isOpera() === false &&
		isIEedge === false
	);
}

export function isIOS(): boolean {
	return !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
}

export function isIOSChrome(): boolean {
	return /CriOS/.test(navigator.userAgent);
}

export function isIOSFirefox(): boolean {
	return /FxiOS/.test(navigator.userAgent);
}

export function isAndroid(): boolean {
	return navigator.userAgent.toLowerCase().indexOf('android') > -1;
}
