<template>
  <h3>收藏夹</h3>
  <div v-for='post in savedPosts' :key='post.id'
      class='ui card post-card'>
    <router-link class='post-link'
      :to='"/post/" + post.id'>
      <i class='ui star icon'></i>{{ post.title }}
    </router-link>
  </div>
</template>

<script>
import { ref } from 'vue';

import { request } from '../utils/api';
import { getSavedPosts } from '../utils/local-history';
import EventBus from '../utils/event-bus';

export default {
  name: 'WidgetSidebar',
  setup() {
    const savedPosts = ref([]);

    const updateSavedPosts = async () => {
      const ids = getSavedPosts();
      ids.reverse().splice(5);
      const posts = new Array(ids.length);
      const promises = ids.map((id, index) => (async () => {
        const [status, body] = await request('GET', `/post/${id}`);
        if (status >= 200 && status < 299)
          posts[index] = body;
      })());
      await Promise.all(promises);
      savedPosts.value = posts;
    };

    updateSavedPosts().then();
    EventBus.on('savedPostsChanged', updateSavedPosts);

    return {
      savedPosts,
    };
  },
};
</script>

<style scoped>
div.post-card {
  background: #fefcfc;
  width: 100%;
  padding: 1ex 1em;
  transition: background ease-out 0.1s;
}
div.post-card:hover {
  background: #ffffff;
}

.post-link {
  font-size: 0.9rem;
  color: #333;
  font-weight: bold;
}
</style>
