import { ref } from 'vue';

const _t = ref(null);

import locale_zh from './locale_zh.js';
import locale_en from './locale_en.js';

_t.value = locale_zh;

const languages = {
  zh: locale_zh,
  en: locale_en,
};

const changeLanguage = (lang) => {
  const t = languages[lang];
  if (!t) {
    changeLanguage('en');
  } else {
    localStorage.lang = lang;
    _t.value = t;
  }
};
changeLanguage(localStorage.lang);

export { languages, _t, changeLanguage };
