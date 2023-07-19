import * as jest from 'jest-mock';
window.test = window.it;

window.test.each = data => (describe, test) => {
	const prs = [];
	for (const d of data) {
		prs.push(window.it(describe, test.bind(undefined, d)));
	}
	return Promise.all(prs);
};

window.jest = jest;
global.setImmediate = global.setImmediate || ((fn, ...args) => global.setTimeout(fn, 0, ...args));
window.setImmediate = global.setImmediate;