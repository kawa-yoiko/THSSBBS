import { ref } from 'vue';

const _t = ref(null);

const locale_zh = {
  Problem: '奇怪的问题出现了！',
  Posts: '帖子',
  Saved: '收藏',
  MyPosts: '我的帖子',
  LogOut: '退出登录',

  Username: '用户名',
  Password: '密码',
  LogIn: '登录',

  SavedList: '收藏夹',
  SavedMore: (x) => `更早的 ${x} 篇……`,
  History: '浏览历史',
  LogInToViewSidebar: '请登录后访问收藏夹和浏览历史',
};

const locale_en = {
};

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
