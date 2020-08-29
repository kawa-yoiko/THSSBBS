const insertAtCursor = (el, text) => {
  if (el.selectionStart) {
    const s = el.value;
    const p = el.selectionStart;
    const q = el.selectionEnd;
    el.value = s.substring(0, p) + text + s.substring(q);
    el.setSelectionRange(p + text.length, p + text.length);
  } else {
    el.value += text;
    el.setSelectionRange(text.length, text.length);
  }
  el.focus();
  el.dispatchEvent(new Event('input'));
};

export {
  insertAtCursor,
};
