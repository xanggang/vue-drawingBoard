
const SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
const MOZ_HACK_REGEXP = /^moz([A-Z])/;

const trim = function(string: string) {
  return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '');
};

const camelCase = function(name: string): string {
  return name.replace(SPECIAL_CHARS_REGEXP, function(_, separator, letter, offset) {
    return offset ? letter.toUpperCase() : letter;
  }).replace(MOZ_HACK_REGEXP, 'Moz$1');
};


/* istanbul ignore next */
export const on = (function() {
  return function(element: Element, event: string, handler: EventListenerObject) {
    if (element && event && handler) {
      element.addEventListener(event, handler, false);
    }
  };
})();

/* istanbul ignore next */
export const off = (function() {
  return function(element: Element, event: string, handler: EventListenerObject) {
    if (element && event) {
      element.removeEventListener(event, handler, false);
    }
  };
})();

export const once = function(el: Element, event: string, fn: any) {
  var listener = function() {
    if (fn) {
      // @ts-ignore
      fn.apply(this, arguments);
    }
    // @ts-ignore
    off(el, event, listener);
  };
  // @ts-ignore
  on(el, event, listener);
};


/* istanbul ignore next */
export function hasClass(el: Element, cls: string) {
  if (!el || !cls) return false;
  if (cls.indexOf(' ') !== -1) throw new Error('className should not contain space.');
  if (el.classList) {
    return el.classList.contains(cls);
  } else {
    return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1;
  }
};

/* istanbul ignore next */
export function addClass(el: Element, cls: string) {
  if (!el) return;
  var curClass = el.className;
  var classes = (cls || '').split(' ');

  for (var i = 0, j = classes.length; i < j; i++) {
    var clsName = classes[i];
    if (!clsName) continue;

    if (el.classList) {
      el.classList.add(clsName);
    } else if (!hasClass(el, clsName)) {
      curClass += ' ' + clsName;
    }
  }
  if (!el.classList) {
    el.className = curClass;
  }
};

/* istanbul ignore next */
export function removeClass(el: Element, cls: string) {
  if (!el || !cls) return;
  var classes = cls.split(' ');
  var curClass = ' ' + el.className + ' ';

  for (var i = 0, j = classes.length; i < j; i++) {
    var clsName = classes[i];
    if (!clsName) continue;

    if (el.classList) {
      el.classList.remove(clsName);
    } else if (hasClass(el, clsName)) {
      curClass = curClass.replace(' ' + clsName + ' ', ' ');
    }
  }
  if (!el.classList) {
    el.className = trim(curClass);
  }
};

/* istanbul ignore next */
export const getStyle = function(element: HTMLBaseElement, styleName: string) {
  if (!element || !styleName) return null;
  styleName = camelCase(styleName);
  if (styleName === 'float') {
    styleName = 'cssFloat';
  }
  try {
    // @ts-ignore
    var computed = document.defaultView.getComputedStyle(element, '');
    // @ts-ignore
    return element.style[styleName] || computed ? computed[styleName] : null;
  } catch (e) {
    // @ts-ignore
    return element.style[styleName];
  }
}

// @ts-nocheck
export function setStyle(element: HTMLBaseElement, styleName: string, value: string) {
  if (!element || !styleName) return;

  if (typeof styleName === 'object') {
    // @ts-ignore
    for (var prop in styleName) {
      // @ts-ignore
      if (styleName.hasOwnProperty(prop)) {
        setStyle(element, prop, styleName[prop]);
      }
    }
  } else {
    styleName = camelCase(styleName);
    // @ts-ignore
    if (styleName === 'opacity' && ieVersion < 9) {
      // @ts-ignore
      element.style.filter = isNaN(value) ? '' : 'alpha(opacity=' + value * 100 + ')';
    } else {
      // @ts-ignore
      element.style[styleName] = value;
    }
  }
};


export function debounce(func: Function, wait: number) {
  let timeout: any = undefined
  return function () {
    // @ts-ignore
    let context = this;
    let args = arguments;

    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(() => {
      func.apply(context, args)
    }, wait);
  }
}
