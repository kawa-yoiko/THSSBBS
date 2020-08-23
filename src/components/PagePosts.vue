<template>
  <p>Posts page</p>
  <p>Total: {{ postCount }}</p>
  <router-link to='/post/create'>Create post</router-link>
  <div class='post' v-for='post in posts' :key='post.id'>
    <strong>
      <span style='color: #aaa'>#{{ post.id }}&nbsp;</span>
      <router-link :to='"/post/" + post.id'>
        <span v-if='post.title'>{{ post.title }}</span>
        <span v-else  style='color: #aaa'>(Untitled)</span>
      </router-link>
    </strong>
    <p>{{ post.content.substr(0, 300) }}</p>
    <p style='color: #aaa'>
      posted by {{ post.user }} at {{ post.createdAt }}
      <span v-if='post.lastRepliedAt > post.createdAt'>
        <br>
        last reply by {{ post.lastReplyUser }} at {{ post.lastRepliedAt }}
      </span>
    </p>
    <br>
  </div>
</template>

<script>
import { ref } from 'vue';
import { request } from '../utils/api';

export default {
  name: 'PagePosts',
  async setup() {
    const postCount = ref(0);
    const curPage = ref(1);
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
        posts.value = body.posts.map((post) => ({
          id: post.id,
          user: {
            id: post.userId,
            nickname: post.nickname,
          },
          title: post.title,
          content: post.content,
          lastReplyUser: {
            id: post.lastRepliedUserId,
            nickname: post.lastRepliedNickname,
          },
          lastRepliedAt: new Date(post.lastRepliedTime),
          createdAt: new Date(post.created),
          updatedAt: new Date(post.updated),
        }));
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
