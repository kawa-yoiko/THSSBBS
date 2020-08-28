const insertAtCursor = (el, text) => {
  if (el.selectionStart) {
    const s = el.value;
    const p = el.selectionStart;
    const q = el.selectionEnd;
    el.value = s.substring(0, p) + text + s.substring(q);
    el.setSelectionRange(p + text.length, p + text.length);
    el.focus();
  } else {
    el.value += text;
  }
};

export {
  insertAtCursor,
};
