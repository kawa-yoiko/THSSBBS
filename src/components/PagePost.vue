<template>
  <p>Single post page</p>
  <div class='post'>
    <h2><span style='color: #aaa'>#{{ postId }}</span> {{ postTitle }}</h2>
    <p class='by'>by {{ postUser }} at {{ postCreatedAt }}</p>
    <p v-html='postContent'></p>
  </div>
  <hr>
  {{ postReplies.length }} reply/replies
  <div class='replies'>
    <div class='post' v-for='reply in postReplies' :key='reply.id'>
      <strong>
        <span style='color: #aaa'>^{{ reply.id }}</span>
        <span style='color: #88f' v-if='reply.parent !== 0'>
          → ^{{ reply.parent }}
        </span>
        by {{ reply.user }} at {{ reply.createdAt }}
      </strong>
      <p v-html='reply.content'></p>
    </div>
  </div>
  <br>
  <widget-reply :post-id='postId' :parent-id='0' @sent='updatePost' />
</template>

<script>
import { ref, reactive } from 'vue';
import { useRoute } from 'vue-router';

import WidgetReply from './WidgetReply.vue';
import { request } from '../utils/api';

export default {
  name: 'PagePost',
  components: { WidgetReply },
  async setup() {
    const route = useRoute();

    const postId = ref(route.params.id);
    const postUser = reactive({});
    const postTitle = ref('');
    const postCreatedAt = ref(null);
    const postUpdatedAt = ref(null);
    const postContent = ref('');
    const postReplies = ref([]);

    const updatePost = async () => {
      const [status, body] = await request('GET', '/post/' + postId.value);
      if (status >= 200 && status < 299) {
        postUser.id = body.userId;
        postUser.nickname = body.nickname;
        postTitle.value = body.title;
        postCreatedAt.value = new Date(body.created);
        postUpdatedAt.value = new Date(body.updated);
        postContent.value = body.content;
        postReplies.value = body.reply.map((reply) => ({
          id: reply.id,
          parent: reply.replyId,
          user: {
            id: reply.userId,
            nickname: reply.nickname,
          },
          content: reply.content,
          createdAt: new Date(reply.created),
          updatedAt: new Date(reply.updated),
        }));
      }
    };

    await updatePost();

    return {
      postId,
      postUser,
      postTitle,
      postCreatedAt,
      postUpdatedAt,
      postContent,
      postReplies,

      updatePost,
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
</style>
