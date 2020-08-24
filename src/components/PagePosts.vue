<template>
  <router-link to='/post/create'
      class='ui labeled icon orange large fluid button'>
    <i class='plus icon'></i>
    Create post
  </router-link>
  <div v-for='post in posts' :key='post.id'
      class='ui card post-content-card'>
    <router-link :to='"/post/" + post.id' style='color: unset'>
    <div style=''>
      <p style='margin-bottom: 0.75ex; font-weight: bold'>
        <span v-if='post.title'>{{ post.title }}</span>
        <span v-else  style='color: #aaa'>(Untitled)</span>
        <span style='color: #aaa; margin-left: 0.5em'>#{{ post.id }}</span>
      </p>
      <div class='post-content-preview'>
        {{ post.content.substr(0, 2000) }}
      </div>
      <div class='post-content-preview-shadow'></div>
      <p style='color: #aaa'>
        posted by {{ post.user }} at {{ post.createdAt }}
        <span v-if='post.lastRepliedAt > post.createdAt'>
          <br>
          last reply by {{ post.lastReplyUser }} at {{ post.lastRepliedAt }}
        </span>
      </p>
    </div>
    </router-link>
    <br>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';

import { request } from '../utils/api';
import EventBus from '../utils/event-bus';

export default {
  name: 'PagePosts',
  async setup() {
    onMounted(() => EventBus.emit('routerViewLoaded'));

    const postCount = ref(0);
    const curPage = ref(1);
    const posts = ref([]);
    const filterUser = ref(null);

    const updatePosts = async () => {
      const params = {
        page: curPage.value,
        size: 100,
        orderByReply: true,
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
.post-content-preview {
  padding-bottom: 0.75ex;
  max-height: 210px;
  overflow: hidden;
  /*box-shadow: inset 0 -2ex 1ex -1ex #fefbfa;*/
}
.post-content-preview-shadow {
  width: 100%;
  height: 1ex;
  position: relative;
  top: -1ex;
  margin-bottom: -1ex;
  background: linear-gradient(transparent, #fffdfc);
  transition: background ease-out 0.1s;
}

.post-content-card {
  background: #fffdfc;
  width: 100%;
  padding: 1ex 1em;
  transition: background ease-out 0.1s;
}
.post-content-card:hover {
  background: #fffffe;
}
.post-content-card:hover .post-content-preview-shadow {
  background: linear-gradient(transparent, #fffffe);
}
</style>
