const handlers = {};
const handlersOnce = {};

const on = (ev, fn, once) => {
  const container = (once ? handlersOnce : handlers);
  let table = container[ev];
  if (table === undefined) {
    handlers[ev] = table = [];
  }
  table.push(fn);
};

const emit = (ev, arg) => {
  let table = handlers[ev];
  if (table !== undefined) {
    table.forEach((fn) => Promise.resolve(fn(arg)).then());
  }
  table = handlersOnce[ev];
  if (table !== undefined) {
    table.forEach((fn) => Promise.resolve(fn(arg)).then());
    handlersOnce[ev] = undefined;
  }
};

const wait = (ev, timeout) => new Promise((resolve, _) => {
  const handleTimeout =
    timeout === 0 ? null : setTimeout(() => resolve(), timeout);
  on(ev, () => {
    clearTimeout(handleTimeout);
    resolve();
  }, true);
});

export default {
  on,
  emit,
  wait,
};
