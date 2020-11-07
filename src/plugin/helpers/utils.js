
// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
export function debounce(func, wait, immediate) {
  let timeoutID;
  return function () {
    let context = this, args = arguments;
    const later = function () {
      timeoutID = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeoutID;
    clearTimeout(timeoutID);
    timeoutID = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

// loosely copied from 'just-throttle' npm package
// https://github.com/angus-c/just/blob/master/packages/function-throttle/index.js
//
//
export function throttle(fn, interval, immediate) {
  let wait = false;
  let callNow = false;
  return function (...rest) {
    callNow = immediate && !wait;
    const context = this;
    
    if (!wait) {
      wait = true;
      setTimeout(function () {
        wait = false;
        if (!immediate) {
          return fn.call(context, ...rest);
        }
      }, interval);
    }
    
    if (callNow) {
      callNow = false;
      return fn.call(context, ...rest);
    }
  };
}

export class Deferred {

  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }

}