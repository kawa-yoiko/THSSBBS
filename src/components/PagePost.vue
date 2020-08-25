<template>
  <div class='ui card post-content-card'>
    <div v-if='editingPost' class='ui form' style='margin: 1ex 0'>
      <input class='edit-post-title' style='margin-bottom: 1ex'
        v-model='editingPostTitle' placeholder='Title' />
      <widget-editor :preview='previewing ? editingPostContent : null'>
        <textarea class='edit-post-content'
          style='margin-bottom: 1ex; line-height: 1.5' rows='15'
          v-model='editingPostContent' placeholder='Content' />
      </widget-editor>
      <div>
        <div v-if='postId === -1'>
          <button @click='doneEditingPost'
            :class='"ui basic small orange button" +
              (sendEditPostInProgress ? " loading" : "")'>
            <i class='ui paper plane icon'></i>Post
          </button>
        </div>
        <div v-else>
          <button @click='doneEditingPost'
            :class='"ui basic small green button" +
              (sendEditPostInProgress ? " loading disabled" : "")'>
            <i class='ui check icon'></i>Done
          </button>
          <button @click='previewing = !previewing'
              v-if='!sendEditPostInProgress'
              class='ui basic small blue button'>
            <template v-if='previewing'>
              <i class='ui edit icon'></i>Write
            </template>
            <template v-else>
              <i class='ui file alternate outline icon'></i>Preview
            </template>
          </button>
          <button @click='editingPost = false'
              v-if='!sendEditPostInProgress'
              class='ui basic small button'>
            <i class='ui x icon'></i>Cancel
          </button>
        </div>
      </div>
    </div>
    <div v-else>
      <p style='font-size: 1.5rem; font-weight: bold; margin-bottom: 0.5ex'>
        {{ postTitle }}
        <span style='color: #aaa; margin-left: 0.5em'>#{{ postId }}</span>
      </p>
      <p style='color: #aaa'>
        <widget-user-badge :user='postUser' />
        <span style='margin: 0 0.25em'></span>
        <widget-time :time='postCreatedAt' />
        <template v-if='postCreatedAt < postUpdatedAt'>
          <span>（更新于 <widget-time :time='postUpdatedAt' />）</span>
        </template>
        <button v-if='postUser.id === localUser.id'
            @click='startEditingPost'
            class='ui basic right floated small button'
            style='position: relative; top: -4px'>
          <i class='pencil alternate icon'></i>Edit
        </button>
        <button @click='savePost(postId); postSaved = !postSaved'
            :class='"ui basic right floated small icon button" +
              (postSaved ? " orange" : "")'
            style='position: relative; top: -4px'>
          <i class='star outline icon'></i>
        </button>
      </p>
      <hr style='background: #aaa; border: none; height: 1px'>
      <p class='post-content' v-html='parseContent(postContent)'></p>
    </div>
  </div>
  <div v-if='postId !== -1'>
    <div class='post'>
      <widget-compose-reply :post-id='postId' :parent-id='0' @sent='refreshPost(0)' />
    </div>
    <p>{{ postRepliesCount }} 条回复</p>
    <div class='replies'>
      <div class='post' v-for='reply in postReplies' :key='reply.id'>
        <widget-reply :level='0'
          :postId='postId' :reply='reply'
          :localUserId='localUser.id'
          @editOrReplyComplete='refreshPost'/>
      </div>
    </div>
    <div id='thread-more'
      v-if='postReplies.length > 0 &&
        !postReplies[postReplies.length - 1].visible'>
      Scroll down to load more!
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import WidgetReply from './WidgetReply.vue';
import WidgetComposeReply from './WidgetComposeReply.vue';
import WidgetUserBadge from './WidgetUserBadge';
import WidgetTime from './WidgetTime';
import WidgetEditor from './WidgetEditor';
import { request, getLocalUser } from '../utils/api';
import EventBus from '../utils/event-bus';
import {
  markRepliesAsVisible, saveVisibleReplies, restoreVisibleReplies
} from '../utils/reply-tree.js';
import parseContent from '../utils/parse-content';
import { savePost, isPostSaved } from '../utils/local-history';

export default {
  name: 'PagePost',
  components: {
    WidgetReply,
    WidgetComposeReply,
    WidgetUserBadge,
    WidgetTime,
    WidgetEditor,
  },
  async setup() {
    onMounted(() => EventBus.emit('routerViewLoaded'));

    const route = useRoute();
    const router = useRouter();

    const postId = ref(route.params.id === 'create' ? -1 : route.params.id);
    const postUser = reactive({});
    const postTitle = ref('');
    const postCreatedAt = ref(null);
    const postUpdatedAt = ref(null);
    const postContent = ref('');
    const postReplies = ref(null);
    const postRepliesCount = ref(0);

    // `parentToUpdate` is the parent reply of the newly created reply
    // or 0 if a new top-level reply has been created
    // or undefined if the event is an update
    const refreshPost = async (parentToUpdate) => {
      // For saving the list of visible replies on refresh
      const visibleReplies =
        postReplies.value === null ? null :
        saveVisibleReplies(postReplies.value);

      const [status, body] = await request('GET', '/post/' + postId.value);
      if (status >= 200 && status < 299) {
        postUser.id = body.userId;
        postUser.nickname = body.nickname;
        postTitle.value = body.title;
        postCreatedAt.value = new Date(body.created);
        postUpdatedAt.value = new Date(body.updated);
        postContent.value = body.content;
        // List of replies
        const list = body.reply.map((reply) => ({
          id: reply.id,
          parent: reply.replyId,
          user: {
            id: reply.userId,
            nickname: reply.nickname,
          },
          content: reply.content,
          createdAt: new Date(reply.created),
          updatedAt: new Date(reply.updated),
          replies: [],
          visible: false,
        }));
        postRepliesCount.value = list.length;
        // Sorted list of replies, as a tree in brackets representation
        const sortedList = [];
        // Lookup table from reply ID to node's child list
        const lookup = { 0: sortedList };
        // Build the tree
        list.forEach((reply) => {
          const parent = lookup[reply.parent];
          parent.push(reply);
          lookup[reply.id] = reply.replies;
        });
        // Show replies
        if (visibleReplies === null) {
          //markRepliesAsVisible(sortedList, 10, [8, 6, 4, 2]);
          markRepliesAsVisible(sortedList, 6, [1, 1]);
        } else {
          restoreVisibleReplies(sortedList, visibleReplies);
        }
        // Highlight the parent and show the last reply
        // Note that `lookup[0]` automatically gives `sortedList`
        if (parentToUpdate !== undefined) {
          const replyListToHighlight = lookup[parentToUpdate];
          markRepliesAsVisible(replyListToHighlight, 999999, []);
        }
        postReplies.value = sortedList;
      }
    };

    // No need to debounce since the callback is lightweight enough
    const scrollHandler = () => {
      const body = document.body;
      const html = document.documentElement;
      const pageSize = Math.max(
        body.scrollHeight, body.offsetHeight,
        html.clientHeight, html.scrollHeight, html.offsetHeight);
      if (pageSize - (window.scrollY + window.innerHeight) <= 40) {
        if (postReplies.value !== null)
          markRepliesAsVisible(postReplies.value, 6, [4, 2]);
      }
    };
    window.addEventListener('scroll', scrollHandler);

    onUnmounted(() => {
      window.removeEventListener('scroll', scrollHandler);
    });

    if (postId.value !== -1) await refreshPost();

    const editingPost = ref(postId.value === -1);
    const editingPostTitle = ref('');
    const editingPostContent = ref('');
    const previewing = ref(false);
    const sendEditPostInProgress = ref(false);

    const startEditingPost = () => {
      editingPost.value = true;
      editingPostTitle.value = postTitle.value;
      editingPostContent.value = postContent.value;
      previewing.value = false;
    };
    const doneEditingPost = async () => {
      sendEditPostInProgress.value = true;

      let method, url;
      if (postId.value === -1) {
        method = 'POST';
        url = '/post';
      } else {
        method = 'PUT';
        url = `/post/${postId.value}`;
      }
      const [status, body] = await request(
        method, url, {
          title: editingPostTitle.value,
          content: editingPostContent.value,
        }
      );

      if (status >= 200 && status < 299) {
        if (postId.value === -1) {
          // Redirect to the newly created post
          const newId = body.postId;
          router.replace(`/post/${newId}`);
          postId.value = newId;
        }
      }

      editingPost.value = false;
      sendEditPostInProgress.value = false;

      await refreshPost();
    };

    const postSaved = ref(isPostSaved(postId.value));

    return {
      postId,
      postUser,
      postTitle,
      postCreatedAt,
      postUpdatedAt,
      postContent,
      postReplies,
      postRepliesCount,

      editingPost,
      editingPostTitle,
      editingPostContent,
      previewing,
      sendEditPostInProgress,
      startEditingPost,
      doneEditingPost,

      // Previous requests may set local user to null
      localUser: await getLocalUser() || {},

      refreshPost,

      parseContent,

      savePost,
      postSaved,
    };
  }
};
</script>

<style scoped>
.post-content-card {
  background: #fefcfc;
  width: 100%;
  padding: 1ex 1em;
  overflow: hidden;
}
.post-content {
  margin: 1.5ex 0 1ex 0;
}
.edit-post-title {
  width: 100%;
}
.edit-post-content {
  width: 100%;
}
#thread-more {
  margin-bottom: 100px;
}
</style>
