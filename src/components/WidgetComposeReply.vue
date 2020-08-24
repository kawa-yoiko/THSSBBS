<template>
  <div class='container'>
    <div class='ui form' style='margin-bottom: 1ex'>
      <textarea rows='7' v-model='replyContents'
        :placeholder='"Reply to " + (parentId !== 0 ? "^" + parentId : "#" + postId)'
        />
    </div>
    <div>
      <button @click='sendReply'
        :class='"ui basic small orange button" +
          (sendReplyInProgress ? " loading disabled" : "")'>
        <i class='ui paper plane icon'></i>
        Post
      </button>
      <button @click='onCancel'
        v-if='parentId !== 0 && !sendReplyInProgress'
        class='ui basic small button'
      >
        <i class='ui x icon'></i>
        Cancel
      </button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

import { request } from '../utils/api';

export default {
  name: 'WidgetComposeReply',
  props: [
    'postId', 'parentId', 'onSent', 'onCancel',
  ],
  setup(props) {
    const replyContents = ref('');
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
