<template>
  <div class='container'>
    <div class='ui form' style='margin-bottom: 1ex'>
      <widget-editor :preview='previewing ? replyContents : null'>
        <textarea style='line-height: 1.5' rows='7' v-model='replyContents'
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
      <button @click='previewing = !previewing'
          v-if='!sendReplyInProgress'
          class='ui basic small blue button'>
        <template v-if='previewing'>
          <i class='ui edit icon'></i>写作
        </template>
        <template v-else>
          <i class='ui file alternate outline icon'></i>预览
        </template>
      </button>
      <button @click='onCancel'
          v-if='parentId !== 0 && !sendReplyInProgress'
          class='ui basic small button'>
        <i class='ui x icon'></i>取消
      </button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

import WidgetEditor from './WidgetEditor';
import { request } from '../utils/api';

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

    return {
      replyContents,
      previewing,
      sendReplyInProgress,

      sendReply,
    }
  }
};
</script>

<style scoped>
.container {
  margin-bottom: 12px;
}
</style>
