<template>
  <div class='reply' v-if='reply.visible'>
    <strong>
      <span style='color: #aaa'>^{{ reply.id }}</span>
      <span style='color: #88f' v-if='reply.parent !== 0'>
        → ^{{ reply.parent }}
      </span>
      by {{ reply.user }} at {{ reply.createdAt }}
    </strong>
    <button @click='startComposingReply'>Reply</button>
    <button v-if='reply.user.id === localUserId'
        @click='startEditingReply(reply)'>
      Edit
    </button>
    <div v-if='editingReply'>
      editing
      <textarea v-model='editingReplyContent' />
      <br>
      <div v-if='sendEditReplyInProgress'>
        sending
      </div>
      <div v-else>
        <button @click='doneEditingReply'>Done</button>
        <button @click='editingReply = false'>Cancel</button>
      </div>
    </div>
    <p v-else v-html='replyContent'></p>
    <widget-compose-reply v-if='composingReply'
      :post-id='postId' :parent-id='reply.id'
      @sent='doneComposingReply'
      @cancel='composingReply = false' />
    <div v-for='subreply in reply.replies' :key='subreply.id'>
      <widget-reply :level='level + 1'
        :postId='postId' :reply='subreply'
        :localUserId='localUserId'
        @editOrReplyComplete='onEditOrReplyComplete'/>
    </div>
    <div v-if='reply.replies.length > 0 &&
        !reply.replies[reply.replies.length - 1].visible'>
      <button @click='expand'>More</button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';

import WidgetComposeReply from './WidgetComposeReply.vue';
import { request } from '../utils/api';
import { markRepliesAsVisible } from '../utils/reply-tree.js';

export default {
  name: 'WidgetReply',
  components: { WidgetComposeReply },
  props: [
    'level', 'postId', 'reply', 'localUserId',
    'onEditOrReplyComplete'
  ],
  setup(props) {
    const replyContent = ref(props.reply.content);

    const editingReply = ref(false);
    const editingReplyContent = ref('');
    const sendEditReplyInProgress = ref(false);

    const startEditingReply = (reply) => {
      editingReply.value = true;
      editingReplyContent.value = reply.content;
    };

    const doneEditingReply = async () => {
      sendEditReplyInProgress.value = true;

      const [status, body] = await request(
        'PUT', `/post/${props.postId}/reply/${props.reply.id}`,
        { content: editingReplyContent.value }
      );

      if (status >= 200 && status < 299) {
        replyContent.value = editingReplyContent.value;
        props.onEditOrReplyComplete.call();
      }

      sendEditReplyInProgress.value = false;
      editingReply.value = false;
    };

    const composingReply = ref(false);

    const startComposingReply = () => {
      composingReply.value = true;
    };

    const doneComposingReply = () => {
      composingReply.value = false;
      props.onEditOrReplyComplete.call();
    };

    const expand = () => {
      markRepliesAsVisible(props.reply.replies, 8, [6, 4, 2]);
    };

    return {
      replyContent,
      editingReply,
      editingReplyContent,
      sendEditReplyInProgress,
      startEditingReply,
      doneEditingReply,

      composingReply,
      startComposingReply,
      doneComposingReply,

      expand,
    };
  }
};
</script>

<style scoped>
.reply {
  padding-left: 15px;
  border-left: #ddd solid 2px;
  margin-bottom: 12px;
}
</style>
