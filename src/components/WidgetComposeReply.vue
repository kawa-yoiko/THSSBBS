<template>
  <div class='container'>
    <h3>
      Reply → {{ parentId !== 0 ? '^' + parentId : '#' + postId }}
    </h3>
    <textarea rows='7' cols='50' v-model='replyContents' />
    <br>
    <div v-if='sendReplyInProgress'>
      sending
    </div>
    <div v-else>
      <button @click='sendReply'>Post</button>
      <button @click='onCancel' v-if='parentId !== 0'>Cancel</button>
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
  text-align: left;
  margin-bottom: 12px;
}
textarea {
  font-family: inherit;
}
</style>
