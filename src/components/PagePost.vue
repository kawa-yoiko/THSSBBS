<template>
  <p>Single post page</p>
  <div class='post'>
    {{ postId }}<br>
    <h2>{{ postTitle }}</h2>
    by {{ postUser }} at {{ postCreatedAt }}
    <br>
    {{ postContent }}
  </div>
</template>

<script>
import { ref, reactive } from 'vue';
import { useRoute } from 'vue-router';

import { request } from '../utils/api';

export default {
  name: 'PagePost',
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
        postCreatedAt.value = body.created;
        postUpdatedAt.value = body.updated;
        postContent.value = body.content;
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
</style>
