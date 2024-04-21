// guided by advice from chatGPT
function customDebounce(func, wait) {
  let timeout; // timeout id

  return function executedFunction(...args) { // spread operator
    const context = this;
    const later = function later() {
      timeout = null; // reset timer
      func.apply(context, args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait); // new timeout delay
  };
}

export default customDebounce;
