<template>
  <p>Single post page</p>
  <div class='post'>
    <div v-if='editingPost'>
      <input class='edit-post-title'
        v-model='editingPostTitle' placeholder='Title' />
      <textarea class='edit-post-content' rows='10'
        v-model='editingPostContent' placeholder='Content' />
      <div v-if='sendEditPostInProgress'>
        sending
      </div>
      <div v-else>
        <button @click='doneEditingPost'>Done</button>
        <button v-if='postId !== -1' @click='editingPost = false'>Cancel</button>
      </div>
    </div>
    <div v-else>
      <h2>
        <span style='color: #aaa'>#{{ postId }}</span> {{ postTitle }}
        <button v-if='postUser.id === localUser.id'
          @click='startEditingPost'>Edit</button>
      </h2>
      <p class='by'>by {{ postUser }} at {{ postCreatedAt }}</p>
      <p v-html='postContent'></p>
    </div>
  </div>
  <div v-if='postId !== -1'>
    <hr>
    <div class='post'>
      <widget-compose-reply :post-id='postId' :parent-id='0' @sent='refreshPost(0)' />
    </div>
    <br>
    {{ postReplies.length }} reply/replies
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
import { request, getLocalUser } from '../utils/api';
import EventBus from '../utils/event-bus';
import {
  markRepliesAsVisible, saveVisibleReplies, restoreVisibleReplies
} from '../utils/reply-tree.js';

export default {
  name: 'PagePost',
  components: { WidgetReply, WidgetComposeReply },
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
    const sendEditPostInProgress = ref(false);

    const startEditingPost = () => {
      editingPost.value = true;
      editingPostTitle.value = postTitle.value;
      editingPostContent.value = postContent.value;
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

    return {
      postId,
      postUser,
      postTitle,
      postCreatedAt,
      postUpdatedAt,
      postContent,
      postReplies,

      editingPost,
      editingPostTitle,
      editingPostContent,
      sendEditPostInProgress,
      startEditingPost,
      doneEditingPost,

      // Previous requests may set local user to null
      localUser: await getLocalUser() || {},

      refreshPost,
    };
  }
};
</script>

<style scoped>
.post {
  text-align: left;
  margin: 0 200px;
}
.by {
  color: #aaa;
  margin: -2ex 0 2ex 0;
}
input, textarea {
  font: inherit;
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
