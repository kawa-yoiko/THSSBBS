const marked = require('marked');
const hljs = require('highlight.js');

import { stickerImage, stickerName } from './sticker-pack';

marked.setOptions({
  highlight: (code, lang) => {
    lang = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(lang, code).value;
  },
  gfm: true,
  silent: true,
});

const renderer = {
  image(href, title, text) {
    let isSticker = false;

    if (!href) {
      href = stickerImage[text];
      isSticker = true;
      if (!href) return text;
    } else {
      isSticker = (stickerName[href] !== undefined);
    }

    let out = '<img src="' + href + '" alt="' + text + '"';
    if (title)
      out += ' title="' + title + '"';
    if (isSticker)
      out += ' style="width: 120px"';

    out += this.options.xhtml ? '/>' : '>';

    if (!isSticker) {
      out =
      `<div style="max-height: 800px; overflow: scroll; cursor: pointer"` +
      ` onclick="window.open('${href}');">${out}</div>`;
    }

    return out;
  }
};
marked.use({ renderer });

const parseContent = (s) => {
  return marked(s);
};

export default parseContent;
