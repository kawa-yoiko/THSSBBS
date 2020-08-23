<template>
  <p>Posts page</p>
  <p>Total: {{ postCount }}</p>
  <div class='post' v-for='post in posts' :key='post.id'>
    [<strong>{{ post.title }}</strong>]
    by {{ post.nickname }} at {{ post.created }}
    <p>{{ post.content }}</p>
    <br>
  </div>
</template>

<script>
import { ref } from 'vue';
import { request } from '../utils/api';

export default {
  name: 'PagePosts',
  async setup() {
    const postCount = ref(1);
    const curPage = ref(0);
    const posts = ref([]);
    const filterUser = ref(null);

    const updatePosts = async () => {
      const params = {
        page: curPage.value,
        size: 100,
      };
      if (filterUser.value !== null) {
        params.userId = filterUser.value.id;
      }
      const resp = await request(
        'GET', '/post', params,
      );
      if (resp[0] >= 200 && resp[0] < 299) {
        postCount.value = resp[1].total;
        posts.value = resp[1].posts;
      }
    };
    await updatePosts();

    return {
      postCount,
      curPage,
      posts,
      filterUser,

      updatePosts,
    };
  }
}
</script>

<style scoped>
.post {
  text-align: left;
  margin: 0 200px;
}
</style>
