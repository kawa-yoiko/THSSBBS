const handlers = {};

const on = (ev, fn) => {
  let table = handlers[ev];
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
};

export default {
  on,
  emit,
};
