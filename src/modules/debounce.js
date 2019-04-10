const TIMEOUT = 600;

export default (fn) => {
  let timerId = null;
  return (...args) => {
    if (timerId) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
      fn(...args);
      timerId = null;
    }, TIMEOUT);
  };
};
