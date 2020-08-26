<template>
  <div class='reply-container' v-if='reply.visible'
      :style='reply.user.id === localUserId ? "border-color: #f9b88e" :
              reply.user.id === opUserId ? "border-color: #aaa" : ""'>
    <span style='color: #aaa; margin-right: 0.5em'>
      <widget-user-badge :user='reply.user'
        :isOp='reply.user.id === opUserId'
        :isLocal='reply.user.id === localUserId' />
      <span style='margin: 0 0.25em'></span>
      <widget-time :time='reply.createdAt' />
      <template v-if='reply.createdAt < reply.updatedAt'>
        <span>（<widget-time :time='reply.updatedAt' prefix='更新于' />）</span>
      </template>
      <strong style='margin-left: 0.5em'>
        <span>^{{ reply.id }}</span>
        <span style='color: #88f' v-if='reply.parent !== 0'>
          → ^{{ reply.parent }}</span>
      </strong>
    </span>
    <button @click='startComposingReply'
        class='ui compact mini basic icon button'
        data-tooltip='Reply'>
      <i class='reply icon'></i>
    </button>
    <button @click='onFoldOrUnfold'
        class='ui compact mini basic icon button'
        :data-tooltip='reply.folded ? "Unfold" : "Fold"'>
      <i :class='(reply.folded ? "plus" : "minus") + " icon"'></i>
    </button>
    <button v-if='reply.user.id === localUserId'
        @click='startEditingReply(reply)'
        class='ui compact mini basic icon button'
        data-tooltip='Edit'>
      <i class='edit icon'></i>
    </button>
  <template v-if='!reply.folded'>
    <div v-if='editingReply' style='margin: 1ex 0'>
      <div class='ui form' style='margin: 1ex 0'>
        <widget-editor :preview='previewing ? editingReplyContent : null'>
          <textarea rows='7' v-model='editingReplyContent' />
        </widget-editor>
      </div>
      <div>
        <button @click='doneEditingReply'
          :class='"ui basic small green button" +
            (sendEditReplyInProgress ? " loading disabled" : "")'>
          <i class='ui check icon'></i>Save
        </button>
        <button @click='previewing = !previewing'
            v-if='!sendEditReplyInProgress'
            class='ui basic small blue button'>
          <template v-if='previewing'>
            <i class='ui edit icon'></i>Write
          </template>
          <template v-else>
            <i class='ui file alternate outline icon'></i>Preview
          </template>
        </button>
        <button @click='editingReply = false'
            v-if='!sendEditReplyInProgress'
            class='ui basic small button'>
          <i class='ui x icon'></i>Cancel
        </button>
      </div>
    </div>
    <p v-else v-html='replyContent'></p>
    <div v-if='composingReply' class='reply-container'>
      <widget-compose-reply
        :post-id='postId' :parent-id='reply.id'
        @sent='doneComposingReply'
        @cancel='composingReply = false' />
    </div>
    <div v-for='subreply in reply.replies' :key='subreply.id'>
      <widget-reply :level='level + 1'
        :postId='postId' :reply='subreply'
        :opUserId='opUserId' :localUserId='localUserId'
        @foldOrUnfold='subreply.folded = !subreply.folded'
        @editOrReplyComplete='onEditOrReplyComplete'/>
    </div>
    <div v-if='reply.replies.length > 0 &&
        !reply.replies.every((x) => x.visible)'>
      <button @click='expand' class='ui basic mini button'>Continue this thread</button>
    </div>
  </template>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';

import WidgetComposeReply from './WidgetComposeReply.vue';
import WidgetUserBadge from './WidgetUserBadge';
import WidgetTime from './WidgetTime';
import WidgetEditor from './WidgetEditor';
import { request } from '../utils/api';
import { markRepliesAsVisible } from '../utils/reply-tree.js';

export default {
  name: 'WidgetReply',
  components: {
    WidgetComposeReply,
    WidgetUserBadge,
    WidgetTime,
    WidgetEditor,
  },
  props: [
    'level', 'postId', 'reply', 'localUserId', 'opUserId',
    'onEditOrReplyComplete', 'onFoldOrUnfold'
  ],
  setup(props) {
    const replyContent = ref(props.reply.content);

    const editingReply = ref(false);
    const editingReplyContent = ref('');
    const previewing = ref(false);
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
        props.onEditOrReplyComplete.call(undefined, undefined);
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
      props.onEditOrReplyComplete.call(undefined, props.reply.id);
    };

    const expand = () => {
      markRepliesAsVisible(props.reply.replies, 8, [6, 4, 2]);
    };

    return {
      replyContent,
      editingReply,
      editingReplyContent,
      previewing,
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
.reply-container {
  padding-left: 15px;
  border-left: #ddd solid 2px;
  margin-bottom: 12px;
}
</style>
