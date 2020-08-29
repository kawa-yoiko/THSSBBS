<template>
  <div class='container'>
    <div class='ui form' style='margin-bottom: 1ex'>
      <widget-editor :preview='previewing ? replyContents : null' ref='editor'>
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
      <button @click='editor.modalStickers.show()'
          class='ui basic small green icon button'>
        <i class='ui smile outline icon'></i>
      </button>
      <button @click='editor.modalHelp.show()'
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
</template>

<script>
import { ref, inject } from 'vue';

import WidgetEditor from './WidgetEditor';
import { request } from '../utils/api';
import parseContent from '../utils/parse-content';

export default {
  name: 'WidgetComposeReply',
  props: [
    'postId', 'parentId', 'onSent', 'onCancel',
  ],
  components: { WidgetEditor },
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

    const editor = ref(null);
    const textarea = ref(null);

    return {
      replyContents,
      previewing,
      sendReplyInProgress,

      sendReply,

      editor,
      textarea,

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
