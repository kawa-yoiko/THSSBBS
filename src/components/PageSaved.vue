<template>
  <span style='font-size: 1.28571429rem; font-weight: bold'>收藏夹</span>
  <span style='color: #aaa; margin-left: 1em'>共 {{ postCount }} 篇帖子</span>
  <div>
    <widget-pagination
      :total='Math.ceil(postCount / pageSize)' :current='curPage' @change='setPage' />

    <div v-if='postsLoading' style='margin-top: 3ex'>
      <div class='ui active centered inline loader'></div>
    </div>
    <div v-else v-for='post in posts' :key='post.id'>
      <widget-post-preview :post='post' />
    </div>

    <widget-pagination
      :total='Math.ceil(postCount / pageSize)' :current='curPage' @change='setPage' />
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';

import WidgetPagination from './WidgetPagination';
import WidgetPostPreview from './WidgetPostPreview';
import { request } from '../utils/api';
import { getSavedPosts } from '../utils/local-history';

export default {
  name: 'PageSaved',
  components: {
    WidgetPagination,
    WidgetPostPreview,
  },
  async setup() {
    const ids = getSavedPosts().reverse();

    const postCount = ref(ids.length);
    const curPage = ref(1);
    const pageSize = 10;
    const posts = ref(null);
    let allPosts = null;

    const postsLoading = ref(false);

    const setPage = (page) => {
      curPage.value = page;
      const p = (curPage.value - 1) * pageSize;
      posts.value = allPosts.slice(p, p + pageSize);
    };

    const updatePosts = async () => {
      postsLoading.value = true;

      // XXX: Duplicate with LayoutSidebar and PagePosts
      allPosts = new Array(ids.length);
      const promises = ids.map((id, index) => (async () => {
        const [status, post] = await request('GET', `/post/${id}`);
        if (status >= 200 && status <= 299) {
          allPosts[index] = {
            id: post.id,
            user: {
              id: post.userId,
              nickname: post.nickname,
            },
            title: post.title,
            content: post.content,
            /*lastReplyUser: {
              id: post.lastRepliedUserId,
              nickname: post.lastRepliedNickname,
            },*/
            lastReplyUser: null,
            lastRepliedAt: new Date(post.lastRepliedTime),
            createdAt: new Date(post.created),
            updatedAt: new Date(post.updated),
          };
        }
      })());
      await Promise.all(promises);
      setPage(1);

      postsLoading.value = false;
    };
    await updatePosts();

    return {
      postCount,
      pageSize,
      curPage,
      posts,
      postsLoading,
      setPage,
    };
  }
};
</script>

<style scoped>
</style>
