const markRepliesAsVisible = (replies, limit, propagate) => {
  const nextLimit = propagate.length > 0 ? propagate[0] : 0;
  propagate = propagate.slice(1);
  let total = 0;

  for (let i = 0; i < replies.length; i++) {
    const r = replies[i];
    if (r.visible) continue;

    r.visible = true;
    total += 1;

    if (nextLimit > 0) {
      const count = markRepliesAsVisible(r.replies, nextLimit, propagate);
      if ((total += count) >= limit) break;
    }
  }

  return total;
};

const saveVisibleReplies = (replies) => {
  const set = {};
  const traverse = (r) => {
    if (r.visible) set[r.id] = true;
    r.replies.forEach(traverse);
  };
  replies.forEach(traverse);
  return set;
};

const restoreVisibleReplies = (replies, set) => {
  const traverse = (r) => {
    r.visible = (set[r.id] === true ? true : false);
    r.replies.forEach(traverse);
  };
  replies.forEach(traverse);
};

export {
  markRepliesAsVisible,
  saveVisibleReplies,
  restoreVisibleReplies,
};
