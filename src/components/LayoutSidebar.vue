<template>
  <div v-if='loggedIn'>
    <router-link to='/saved' style='color: #333'>
      <h4 style='margin-bottom: 1rem'>{{ _t.SavedList }}</h4>
    </router-link>
    <div v-for='post in savedPosts' :key='post.id'
        class='ui card post-card'>
      <router-link class='post-link'
        :to='"/post/" + post.id'>
        <i class='ui star icon'></i>{{ post.title }}
      </router-link>
    </div>
    <router-link v-if='numMoreSavedPosts > 0' to='/saved'>
      {{ _t.SavedMore(numMoreSavedPosts) }}
    </router-link>
    <h4>{{ _t.History }}</h4>
    <button class='ui right floated mini compact basic icon button'
        style='position: relative; top: -6.3ex; margin-bottom: -6.3ex'
        @click='clearHistoryPosts'>
      <i class='trash icon'></i>
    </button>
    <div v-for='post in historyPosts' :key='post.id'
        class='ui card post-card'>
      <router-link class='post-link'
        :to='"/post/" + post.id'>
        <i class='ui history icon'></i>{{ post.title }}
      </router-link>
    </div>
  </div>
  <div v-else>
    {{ _t.LogInToViewSidebar }}
  </div>
</template>

<script>
import { ref } from 'vue';

import { getLocalUser, getPostTitleCached } from '../utils/api';
import {
  getSavedPosts, getHistoryPosts, clearHistory
} from '../utils/local-history';
import EventBus from '../utils/event-bus';
import { _t } from '../utils/i18n';

export default {
  name: 'LayoutSidebar',
  setup() {
    const savedPosts = ref([]);
    const numMoreSavedPosts = ref(0);
    const historyPosts = ref([]);

    const fetchPostList = async (ids) => {
      const posts = new Array(ids.length);
      const promises = ids.map((id, index) => (async () => {
        posts[index] = {
          id,
          title: await getPostTitleCached(id)
        };
      })());
      await Promise.all(promises);
      return posts;
    };

    const updateSavedPosts = async () => {
      const ids = getSavedPosts();
      numMoreSavedPosts.value = ids.reverse().splice(10).length;
      savedPosts.value = await fetchPostList(ids);
    };
    EventBus.on('savedPostsChanged', updateSavedPosts);

    const updateHistoryPosts = async () => {
      const ids = getHistoryPosts();
      historyPosts.value = await fetchPostList(ids);
    };
    EventBus.on('historyPostsChanged', updateHistoryPosts);

    const clearHistoryPosts = () => {
      clearHistory();
      EventBus.emit('historyPostsChanged');
    }

    const loggedIn = ref(false);
    const updateLoggedInState = async () => {
      loggedIn.value = (await getLocalUser()) !== null;
      if (loggedIn.value) {
        updateSavedPosts().then();
        updateHistoryPosts().then();
      }
    };
    EventBus.on('logged-in', updateLoggedInState);
    EventBus.on('logged-out', () => loggedIn.value = false);

    updateLoggedInState().then();

    return {
      _t,

      loggedIn,
      savedPosts,
      numMoreSavedPosts,
      historyPosts,
      clearHistoryPosts,
    };
  },
};
</script>

<style scoped>
div.post-card {
  background: #fefcfc;
  width: 100%;
  padding: 1ex 1em;
  margin: 1.5ex 0;
  transition: background ease-out 0.1s;
}
div.post-card:hover {
  background: #ffffff;
}

.post-link {
  font-size: 0.9rem;
  color: #333;
}
</style>
