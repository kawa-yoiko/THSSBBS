<template>
<div v-if='refreshPostInProgress'>
  <div style='width: 100%'>
    <div class='ui active loader'></div>
  </div>
</div>
<template v-else>
  <div class='ui card post-content-card'>
    <div v-if='editingPost' class='ui form' style='margin: 1ex 0'>
      <input class='edit-post-title' style='margin-bottom: 1ex'
        v-model='editingPostTitle' placeholder='Title' />
      <widget-editor :preview='previewing ? editingPostContent : null' ref='editor'>
        <textarea class='edit-post-content'
          style='margin-bottom: 1ex; line-height: 1.5' rows='15'
          v-model='editingPostContent' placeholder='Content' />
      </widget-editor>
      <div>
        <template v-if='postId === -1'>
          <button @click='doneEditingPost'
            :class='"ui basic small orange button" +
              (sendEditPostInProgress ? " loading" : "")'>
            <i class='ui paper plane icon'></i>{{ _t.PostVerb }}
          </button>
        </template>
        <template v-else>
          <button @click='doneEditingPost'
            :class='"ui basic small orange button" +
              (sendEditPostInProgress ? " loading disabled" : "")'>
            <i class='ui check icon'></i>{{ _t.Save }}
          </button>
          <button @click='previewing = !previewing'
              v-if='!sendEditPostInProgress'
              class='ui basic small blue button'>
            <template v-if='previewing'>
              <i class='ui edit icon'></i>{{ _t.Write }}
            </template>
            <template v-else>
              <i class='ui file alternate outline icon'></i>{{ _t.Preview }}
            </template>
          </button>
        </template>
        <template v-if='!previewing && !sendEditPostInProgress'>
          <button @click='editor.modalStickers.show()'
              class='ui basic small green icon button'>
            <i class='ui smile outline icon'></i>
          </button>
          <button @click='editor.modalHelp.show()'
              class='ui basic small yellow icon button'>
            <i class='ui question icon'></i>
          </button>
        </template>
        <template v-if='postId !== -1'>
          <button @click='editingPost = false'
              v-if='!sendEditPostInProgress'
              class='ui basic small button'>
            <i class='ui x icon'></i>{{ _t.Cancel }}
          </button>
        </template>
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
          <span><widget-time :time='postUpdatedAt' :prefix='_t.UpdatedAtLeft' />{{ _t.UpdatedAtRight }}</span>
        </template>
        <button v-if='postUser.id === localUser.id'
            @click='startEditingPost'
            class='ui basic right floated small button'
            style='position: relative; top: -4px'>
          <i class='pencil alternate icon'></i>{{ _t.Edit }}
        </button>
        <button @click='saveCurrentPost'
            :class='"ui basic right floated small icon button" +
              (postSaved ? " orange" : "")'
            style='position: relative; top: -4px'>
          <i :class='"star icon" + (postSaved ? "" : " outline")'></i>
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
    <p style='margin: 3ex 0 1ex 0'>
      <span style='font-weight: bold'>{{ _t.Replies(postRepliesCount) }}</span>
      <button @click='expandAllOp'
          class='ui compact mini basic icon button'
          style='margin-left: 1em'
          :data-tooltip='_t.OnlyOP'>
        <i class='bullhorn icon'></i>
      </button>
      <button @click='expandAllSelf'
          class='ui compact mini basic icon button'
          :data-tooltip='_t.OnlySelf'>
        <i class='user icon'></i>
      </button>
    </p>
    <div class='replies'>
      <div class='post' v-for='reply in (postReplies || [])' :key='reply.id'>
        <widget-reply :level='0'
          :postId='postId' :reply='reply'
          :opUserId='postUser.id' :localUserId='localUser.id'
          @foldOrUnfold='reply.folded = !reply.folded'
          @editOrReplyComplete='refreshPost'/>
      </div>
    </div>
    <div id='thread-more'
      v-if='(postReplies || []).length > 0 &&
        !postReplies[postReplies.length - 1].visible'>
      {{ _t.ScrollDownForMore }}
    </div>
  </div>
</template>
</template>

<script>
import { ref, reactive, onMounted, onUnmounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import WidgetReply from './WidgetReply.vue';
import WidgetComposeReply from './WidgetComposeReply.vue';
import WidgetUserBadge from './WidgetUserBadge';
import WidgetTime from './WidgetTime';
import WidgetEditor from './WidgetEditor';
import { request, getLocalUser, putPostTitleCached } from '../utils/api';
import EventBus from '../utils/event-bus';
import {
  markRepliesAsVisible, showAllAndExpandAllBy,
  saveVisibleReplies, restoreVisibleReplies
} from '../utils/reply-tree.js';
import parseContent from '../utils/parse-content';
import { savePost, getSavedPosts, addHistory } from '../utils/local-history';
import { _t } from '../utils/i18n';

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

    const postId = ref(-1);
    const postUser = reactive({});
    const postTitle = ref('');
    const postCreatedAt = ref(null);
    const postUpdatedAt = ref(null);
    const postContent = ref('');
    const postReplies = ref(null);
    const postRepliesCount = ref(0);

    const localUser = ref(null);

    const refreshPostInProgress = ref(false);
    // `parentToUpdate` is the parent reply of the newly created reply
    // or 0 if a new top-level reply has been created
    // or undefined if the event is an update
    const refreshPost = async (parentToUpdate) => {
      refreshPostInProgress.value = true;

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
        // Put into the title cache
        putPostTitleCached(postId.value, postTitle.value);
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
          folded: false,
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
        if (visibleReplies === null ||
          !restoreVisibleReplies(sortedList, visibleReplies))
        {
          markRepliesAsVisible(sortedList, 6, [4, 2, 1]);
        }
        // Highlight the parent and show the last reply
        // Note that `lookup[0]` automatically gives `sortedList`
        if (parentToUpdate !== undefined) {
          const replyListToHighlight = lookup[parentToUpdate];
          markRepliesAsVisible(replyListToHighlight, 999999, []);
          // Get the last comment by the current user
          let newId = -1;
          for (let i = replyListToHighlight.length - 1; i >= 0; i--)
            if (replyListToHighlight[i].user.id === localUser.value.id) {
              newId = replyListToHighlight[i].id;
              break;
            }
          setTimeout(() => {
            document.getElementById(`reply-${newId}`)
              .scrollIntoView({ behavior: 'smooth' });
          }, 1000);
        }
        postReplies.value = sortedList;
      }

      refreshPostInProgress.value = false;
    };

    // No need to debounce since the callback is lightweight enough
    const scrollHandler = () => {
      const body = document.body;
      const html = document.documentElement;
      const pageSize = Math.max(
        body.scrollHeight, body.offsetHeight,
        html.clientHeight, html.scrollHeight, html.offsetHeight);
      if (pageSize - (window.scrollY + window.innerHeight) <= 40) {
        markRepliesAsVisible(postReplies.value, 6, [4, 2]);
      }
    };
    onMounted(() => window.addEventListener('scroll', scrollHandler));
    onUnmounted(() => window.removeEventListener('scroll', scrollHandler));

    const expandAllOp = () => {
      //showAllAndExpandAllBy(postReplies.value, postUser.id);
    };
    const expandAllSelf = () => {
      showAllAndExpandAllBy(postReplies.value, localUser.value.id);
    }

    const editor = ref(null);
    const editingPost = ref(false);
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

    const postSaved = ref(false);
    const saveCurrentPost = () => {
      savePost(postId.value);
      postSaved.value = !postSaved.value;
      EventBus.emit('savedPostsChanged');
    };

    const updateWithRoute = async (always) => {
      const newId = route.params.id === 'create' ? -1 : Number(route.params.id);
      if (always || postId.value !== newId) {
        postId.value = newId;
        // XXX: The following two operations might be better
        // merged into `refreshPost()`
        editingPost.value = (postId.value === -1);
        postSaved.value = getSavedPosts().indexOf(newId) !== -1;
        await refreshPost();
        // Add to history
        if (newId !== -1) {
          addHistory(newId);
          EventBus.emit('historyPostsChanged');
        }
      }
    }
    watch(route, async (_n, _o) => await updateWithRoute());
    await updateWithRoute(true);

    // Previous requests may set local user to null
    localUser.value = await getLocalUser() || {};

    return {
      _t,

      postId,
      postUser,
      postTitle,
      postCreatedAt,
      postUpdatedAt,
      postContent,
      postReplies,
      postRepliesCount,

      editor,
      editingPost,
      editingPostTitle,
      editingPostContent,
      previewing,
      sendEditPostInProgress,
      startEditingPost,
      doneEditingPost,

      expandAllOp,
      expandAllSelf,

      localUser,

      refreshPostInProgress,
      refreshPost,

      parseContent,

      saveCurrentPost,
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
}
.post-content {
  margin: 1.5ex 0 1ex 0;
  overflow: auto;
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
