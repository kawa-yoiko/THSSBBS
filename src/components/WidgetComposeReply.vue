<template>
  <div class='container'>
    <div class='ui form' style='margin-bottom: 1ex'>
      <widget-editor :preview='previewing ? replyContents : null'>
        <textarea ref='textarea'
          style='line-height: 1.5' rows='7' v-model='replyContents'
          :placeholder='"Reply to " + (parentId !== 0 ? "^" + parentId : "#" + postId)'
          />
      </widget-editor>
    </div>
    <div>
      <button @click='sendReply'
        :class='"ui basic small orange button" +
          (sendReplyInProgress ? " loading disabled" : "")'>
        <i class='ui paper plane icon'></i>发布
      </button>
    <template v-if='!sendReplyInProgress'>
      <button @click='previewing = !previewing'
          class='ui basic small blue button'>
        <template v-if='previewing'>
          <i class='ui edit icon'></i>写作
        </template>
        <template v-else>
          <i class='ui file alternate outline icon'></i>预览
        </template>
      </button>
      <button @click='showStickers'
          class='ui basic small green icon button'>
        <i class='ui smile outline icon'></i>
      </button>
      <button @click='modalHelp.show()'
          class='ui basic small yellow icon button'>
        <i class='ui question icon'></i>
      </button>
    </template>
      <button @click='onCancel'
          v-if='parentId !== 0 && !sendReplyInProgress'
          class='ui basic small button'>
        <i class='ui x icon'></i>取消
      </button>
    </div>
  </div>
  <widget-modal ref='modalHelp'>
    <h2>Markdown Cheatsheet</h2>
    <table class='ui small celled orange table markdown-cheatsheet'
        style='margin-bottom: 1.5ex'>
      <thead><tr>
        <th>元素</th><th>语法</th><th>效果</th>
      </tr></thead>
      <tbody>
        <tr v-for='(elm, index) in [
          ["粗体", "**bold**"],
          ["斜体", "*italic*"],
          ["标号列表", "1. one\n2. two\n3. three"],
          ["无标号列表", "- one\n- another\n- yet another"],
          ["行内代码", "`() => {}`"],
          ["代码块", "```rust\nfn main() {\n  println!(\"Hello World!\");\n}\n```"],
          ["链接", "[blog](https://kawa.moe/)"],
          ["图片", "![muniko](https://kawa.moe/MunikoSH/19.png)"],
          ["分隔线", "---"],
          ["标题", "# h1\n## h2\n### h3"],
          ["引用文字", "> blockquote"],
          ["表格", "| c1 | c2 |\n|:--:|:--:|\n| qwq | qwq |\n| quq | quq |"],
        ]' :key='index'>
          <td>{{ elm[0] }}</td>
          <td v-html='elm[1].replace(/\n/g, "<br>").replace(/ /g, "&nbsp;")'></td>
          <td v-html='parseContent(elm[1])'></td>
        </tr>
      </tbody>
    </table>
  </widget-modal>
</template>

<script>
import { ref } from 'vue';

import WidgetEditor from './WidgetEditor';
import WidgetModal from './WidgetModal';
import { request } from '../utils/api';
import { insertAtCursor } from '../utils/dom';
import parseContent from '../utils/parse-content';

export default {
  name: 'WidgetComposeReply',
  props: [
    'postId', 'parentId', 'onSent', 'onCancel',
  ],
  components: { WidgetEditor, WidgetModal },
  setup(props) {
    const replyContents = ref('');
    const previewing = ref(false);
    const sendReplyInProgress = ref(false);

    const sendReply = async () => {
      if (!replyContents.value.trim()) return;

      sendReplyInProgress.value = true;

      // Prepare parameters
      const params = { content: replyContents.value };
      if (props.parentId !== 0) {
        params.replyId = props.parentId;
      }
      const [status, body] = await request(
        'POST', `/post/${props.postId}/reply`, params,
      );

      if (status >= 200 && status < 299) {
        replyContents.value = '';
        props.onSent.call();
      }
      
      sendReplyInProgress.value = false;
    };

    const textarea = ref(null);
    const modalHelp = ref(null);

    const showStickers = () => {
      insertAtCursor(textarea.value, '🌰大可爱');
    };

    return {
      replyContents,
      previewing,
      sendReplyInProgress,

      sendReply,

      textarea,
      showStickers,
      modalHelp,

      parseContent,
    }
  }
};
</script>

<style scoped>
.container {
  margin-bottom: 12px;
}
</style>

<style>
table.markdown-cheatsheet img {
  max-width: 200px;
}
</style>
