export default {
  Problem: 'A strange problem occurred!',
  Posts: 'Posts',
  Saved: 'Saved',
  MyPosts: 'My posts',
  LogOut: 'Log out',

  Username: 'Username',
  Password: 'Password',
  LogIn: 'Log in',

  SavedList: 'Saved posts',
  SavedMore: (x) => `Earlier ${x} post${x == 1 ? '' : 's'}...`,
  History: 'Visit history',
  LogInToViewSidebar: 'Please log in to access saved posts and visit history',

  CreateNewPost: 'Create post',
  RecentPosts: 'Recent posts',
  PostedBy: 'Posted by: ',
  OrderBy: ['Order by most recent activity', 'Order by most recent original post update'],

  ReplyTo: 'Reply to ',
  PostVerb: 'Post',
  Save: 'Save',
  Write: 'Write',
  Preview: 'Preview',
  Cancel: 'Cancel',
  UpdatedAtLeft: ' (Updated ',
  UpdatedAtRight: ')',
  Edit: 'Edit',
  Replies: (x) => `${x} repl${x == 1 ? 'y' : 'ies'}`,
  OnlyOP: 'Show only OP\'s replies',
  OnlySelf: 'Show only my replies',
  ScrollDownForMore: '↓ Scroll down to load more',

  PostedAt: 'posted ',
  ActiveAt: 'active ',

  ReplyVerb: 'Reply',
  Fold: 'Fold',
  Unfold: 'Unfold',
  ContinueThisThread: 'Continue this thread',

  MarkdownElement: 'Element',
  MarkdownSyntax: 'Syntax',
  MarkdownOutcome: 'Outcome',
  MarkdownBold: 'Bold text',
  MarkdownItalic: 'Italic text',
  MarkdownInlineCode: 'Inline code',
  MarkdownBlockCode: 'Code block',
  MarkdownLink: 'Link',
  MarkdownImage: 'Image',
  MarkdownRule: 'Horizontal rule',
  MarkdownHeader: 'Header',
  MarkdownBlockquote: 'Blockquote',
  MarkdownOrderedList: 'Ordered list',
  MarkdownUnorderedList: 'Unordered list',
  MarkdownTable: 'Table',
  MarkdownHighlightJS:
    'See <a target="_blank" href="https://highlightjs.org/">highlight.js docs</a>' +
    ' for a list of supported languages',
  MarkdownRecommendedImageService:
    'External image hosting services such as' +
    ' <a target="_blank" href="https://sm.ms/">sm.ms</a> are recommended',
  MarkdownMoreDetails: `
    For more details, please see
    <a href='https://spec.commonmark.org/0.29/'>the CommonMark specs</a>
    and
    <a href='https://github.github.com/gfm/'>the GFM specs</a>
  `,
};
