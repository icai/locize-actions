export function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

export function replaceIn(str, arr, options) {
	let ret = str;
	arr.forEach(s => {
		const regexp = new RegExp(`{{${s}}}`, 'g');
		ret = ret.replace(regexp, options[s]);
	});

	return ret;
}

export function isMissingOption(obj, props) {
  return props.reduce((mem, p) => {
    if (mem) return mem;
    if (!obj || !obj[p] || typeof obj[p] !== 'string' || !obj[p].toLowerCase() === p.toLowerCase()) {
      const err = `i18next-lastused :: got "${obj[p]}" in options for ${p} which is invalid.`;
      console.warn(err);
      return err;
    }
    return false;
  }, false)
}

export function optionExist(obj, props) {
  return !isMissingOption(obj, props);
}


export function isEmptyObj(obj) {
  return (Array.isArray(obj) && obj.length == 0) || Object.keys(obj).length == 0
}
