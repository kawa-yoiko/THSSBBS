<template>
  <div :style='preview !== null ? "display: none" : ""' ref='slotContainer'>
    <slot />
  </div>
  <div style='margin: 1ex 0 2ex 0' v-if='preview !== null'>
    <p style='margin-bottom: 0.75ex; font-size: 1.2rem; font-weight: bold'>预览</p>
    <div class='post-content' v-html='parseContent(preview)' />
  </div>

  <widget-modal ref='modalStickers'>
    <table>
      <tr v-for='(_, i) in 8' :key='i'>
        <td v-for='(_, j) in 5' :key='j'>
          <img @click='enterSticker'
            :alt='`Muniko_${i * 5 + j}`'
            :src='stickerImage[`Muniko_${i * 5 + j}`]'>
        </td>
      </tr>
    </table>
    <p style='color: #aaa; margin-bottom: 1.5ex'>
      <a target="_blank" href='https://t.me/addstickers/MunikoSH'>Muniko</a> - Shirohi Hitomi
    </p>
  </widget-modal>

  <widget-modal ref='modalHelp'>
    <h2>Markdown Cheatsheet</h2>
    <table class='ui small celled orange table markdown-cheatsheet'
        style='margin-bottom: 1.5ex; width: 840px'>
      <thead><tr>
        <th style='width: 20%'>元素</th>
        <th style='width: 40%'>语法</th>
        <th style='width: 40%'>效果</th>
      </tr></thead>
      <tbody>
        <tr v-for='(elm, index) in [
          ["粗体", "**bold**"],
          ["斜体", "*italic*"],
          ["行内代码", "`() => {}`"],
          ["代码块", "```rust\nfn main() {\n  println!(\"Hello World!\");\n}\n```"],
          ["链接", "[blog](https://kawa.moe/)"],
          ["图片", "![muniko](https://kawa.moe/MunikoSH/19.png)",
            "推荐使用 <a target=\"_blank\" href=\"https://sm.ms/\">sm.ms</a> 等图床服务"],
          ["分隔线", "---"],
          ["标题", "# h1\n## h2\n### h3"],
          ["引文", "> blockquote"],
          ["标号列表", "1. one\n2. two\n3. three\n4. yuanfen"],
          ["无标号列表", "- one\n- another\n- yet another"],
          ["表格", "| foo | bar | baz |\n| --- | --- | --- |\n| qwq | qwq | qwq |\n| quq | quq | quq |"],
        ]' :key='index'>
          <td>{{ elm[0] }}</td>
          <td v-html='elm[1].replace(/\n/g, "<br>").replace(/ /g, "&nbsp;") +
            (elm[2] ? "<p style=\"color: #aaa; margin-top: 1.5ex\">" + elm[2] + "</p>" : "")'></td>
          <td v-html='parseContent(elm[1])'></td>
        </tr>
      </tbody>
    </table>
    <p style='color: #aaa; margin-bottom: 1.5ex'>
      更多细节参见
      <a href='https://spec.commonmark.org/0.29/'>CommonMark 标准</a>
      与
      <a href='https://github.github.com/gfm/'>GFM 标准</a>
    </p>
  </widget-modal>
</template>

<script>
import { ref } from 'vue';

import WidgetModal from './WidgetModal';
import { stickerImage } from '../utils/sticker-pack';
import parseContent from '../utils/parse-content';
import { insertAtCursor } from '../utils/dom';

export default {
  name: 'WidgetEditor',
  props: ['preview'],
  components: { WidgetModal },
  setup(props) {
    const modalStickers = ref(null);
    const modalHelp = ref(null);
    const slotContainer = ref(null);

    const enterSticker = (e) => {
      // XXX: Maybe find the first HTMLTextAreaElement
      const input = slotContainer.value.children[0];
      const alt = e.target.attributes.alt.value;
      insertAtCursor(input, `![${alt}]()`);
      modalStickers.value.hide();
    };

    return {
      parseContent,
      modalStickers,
      modalHelp,
      slotContainer,
      stickerImage,
      enterSticker,
    };
  }
};
</script>

<style scoped>
img {
  width: 120px;
  cursor: pointer;
}
td {
  width: 120px;
  height: 120px;
}
</style>

<style>
table.markdown-cheatsheet img {
  max-width: 200px;
}
</style>
