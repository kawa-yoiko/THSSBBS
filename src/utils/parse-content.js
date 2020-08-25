const marked = require('marked');
const hljs = require('highlight.js');

marked.setOptions({
  highlight: (code, lang) => {
    lang = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(lang, code).value;
  },
  gfm: true,
  silent: true,
});

const parseContent = (s) => {
  return marked(s);
};

export default parseContent;
