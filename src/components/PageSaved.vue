<template>
  <div>
    <widget-pagination
      :total='Math.ceil(postCount / pageSize)' :current='curPage' @change='setPage' />

    <div v-if='postsLoading' style='margin-top: 3ex'>
      <div class='ui active centered inline loader'></div>
    </div>

    <widget-pagination
      :total='Math.ceil(postCount / pageSize)' :current='curPage' @change='setPage' />
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';

import WidgetPagination from './WidgetPagination';
import WidgetPostPreview from './WidgetPostPreview';
import { getSavedPosts } from '../utils/local-history';

export default {
  name: 'PageSaved',
  components: {
    WidgetPagination,
    WidgetPostPreview,
  },
  async setup() {
    const ids = getSavedPosts();

    const postCount = ref(ids.length);
    const curPage = ref(1);
    const pageSize = 10;

    const postsLoading = ref(false);

    const setPage = (page) => {
      curPage.value = page;
    };

    const updatePosts = async () => {
    };
    await updatePosts();

    return {
      postCount,
      pageSize,
      curPage,
      postsLoading,
      setPage,
    };
  }
};
</script>

<style scoped>
</style>
