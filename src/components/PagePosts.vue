<template>
  <p>Posts page</p>
  <p>Total: {{ postCount }}</p>
  <div class='post' v-for='post in posts' :key='post.id'>
    <router-link :to='"/post/" + post.id'>
      [<strong>{{ post.title }}</strong>]
    </router-link>
    by {{ post.nickname }} at {{ post.created }}
    <p>{{ post.content.substr(0, 300) }}</p>
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
      const [status, body] = await request('GET', '/post', params);
      if (status >= 200 && status < 299) {
        postCount.value = body.total;
        posts.value = body.posts;
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
