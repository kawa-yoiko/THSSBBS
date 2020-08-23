<template>
  <div class='reply'>
    <strong>
      <span style='color: #aaa'>^{{ reply.id }}</span>
      <span style='color: #88f' v-if='reply.parent !== 0'>
        → ^{{ reply.parent }}
      </span>
      by {{ reply.user }} at {{ reply.createdAt }}
    </strong>
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
    <div v-for='subreply in reply.replies' :key='subreply.id'>
      <widget-reply :level='level + 1'
        :postId='postId' :reply='subreply'
        :localUserId='localUserId'
        @editComplete='onEditComplete'/>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { request } from '../utils/api';

export default {
  name: 'WidgetReply',
  props: ['level', 'postId', 'reply', 'localUserId', 'onEditComplete'],
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
        props.onEditComplete.call();
      }

      sendEditReplyInProgress.value = false;
      editingReply.value = false;
    };

    return {
      replyContent,
      editingReply,
      editingReplyContent,
      sendEditReplyInProgress,
      startEditingReply,
      doneEditingReply,
    };
  }
};
</script>

<style scoped>
.reply {
  padding-left: 15px;
  border-left: #ddd solid 2px;
}
</style>
