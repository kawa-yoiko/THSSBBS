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
    if (!href) {
      href = stickerImage[text];
      if (!href) return text;
    }

    let out = '<img src="' + href + '" alt="' + text + '"';
    if (title)
      out += ' title="' + title + '"';
    if (stickerName[href] !== undefined)
      out += ' style="width: 120px"';

    out += this.options.xhtml ? '/>' : '>';
    return out;
  }
};
marked.use({ renderer });

const parseContent = (s) => {
  return marked(s);
};

export default parseContent;
