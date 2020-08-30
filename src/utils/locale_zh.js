export default {
  name: 'zh',

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

  CreateNewPost: '发布新帖',
  RecentPosts: '最近帖子',
  PostedBy: '发布者：',
  OrderBy: ['按最近活动时间降序', '按主帖更新时间降序'],

  PostsInTotal: (x) => `共 ${x} 篇帖子`,

  ReplyTo: '回复 ',
  PostVerb: '发布',
  Save: '保存',
  Write: '写作',
  Preview: '预览',
  Cancel: '取消',
  UpdatedAtLeft: '（更新于',
  UpdatedAtRight: '）',
  Edit: '编辑',
  Replies: (x) => `${x} 条回复`,
  OnlyOP: '只看楼主',
  OnlySelf: '只看自己',
  ScrollDownForMore: '↓ 向下滚动显示更多',

  PostedAt: '发布于',
  ActiveAt: '活动于',

  ReplyVerb: '回复',
  Fold: '折叠',
  Unfold: '展开',
  ContinueThisThread: '展开此讨论串',

  MarkdownElement: '元素',
  MarkdownSyntax: '语法',
  MarkdownOutcome: '效果',
  MarkdownBold: '粗体',
  MarkdownItalic: '斜体',
  MarkdownInlineCode: '行内代码',
  MarkdownBlockCode: '代码块',
  MarkdownLink: '链接',
  MarkdownImage: '图片',
  MarkdownRule: '分隔线',
  MarkdownHeader: '标题',
  MarkdownBlockquote: '引文',
  MarkdownOrderedList: '标号列表',
  MarkdownUnorderedList: '无标号列表',
  MarkdownTable: '表格',
  MarkdownHighlightJS:
    '支持的语言参见 <a target="_blank" href="https://highlightjs.org/">highlight.js 文档</a>',
  MarkdownRecommendedImageService:
    '推荐使用 <a target="_blank" href="https://sm.ms/">sm.ms</a> 等图床服务',
  MarkdownMoreDetails: `
    更多细节参见
    <a href='https://spec.commonmark.org/0.29/'>CommonMark 标准</a>
    与
    <a href='https://github.github.com/gfm/'>GFM 标准</a>
  `,

  MomentJSLocale: 'zh-cn',
};
