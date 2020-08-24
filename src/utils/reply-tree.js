const markRepliesAsVisible = (replies, limit, propagate) => {
  const nextLimit = propagate.length > 0 ? propagate[0] : 0;
  propagate = propagate.slice(1);
  let total = 0;

  for (let i = 0; i < replies.length; i++) {
    const r = replies[i];
    if (r.visible) continue;

    r.visible = true;
    if ((total += 1) >= limit) break;

    const newLimit = Math.min(limit - total, nextLimit);
    if (newLimit > 0) {
      const count = markRepliesAsVisible(r.replies, newLimit, propagate);
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
