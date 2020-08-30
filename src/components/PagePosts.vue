<template>
  <router-link to='/post/create'
      class='ui labeled icon orange large fluid button'
      style='letter-spacing: 1.5px'>
    <i class='plus icon'></i>
    {{ _t.CreateNewPost }}
  </router-link>
  <div style='margin-top: 0' class='ui three column grid'>
    <div class='six wide column'>
      <button class='ui small basic icon button' @click='updatePosts'>
        <i class='ui sync alternate icon'></i>
      </button>
      <span style='margin-left: 0.5em;
          position: absolute; bottom: 1.8ex;
          font-size: 1.28571429rem; font-weight: bold'>
        {{ _t.RecentPosts }}</span>
    </div>
    <div class='ten wide column'>
      <div class='ui right floated mini compact menu'>
        <router-link class='ui mini link item'
            v-if='filterUser !== null'
            to='/posts'>
          {{ _t.PostedBy }}<span style='font-weight: bold'>{{ filterUser.nickname }}</span>
          <i class='x icon' style='margin: 0 0 0 0.35714286em'></i>
        </router-link>
        <div class='ui mini simple dropdown item'>
          {{ _t.OrderBy[orderBy] }}
          <i class='dropdown icon'></i>
          <div class='menu'>
            <div class='item' @click='setOrderBy(0)'>{{ _t.OrderBy[0] }}</div>
            <div class='item' @click='setOrderBy(1)'>{{ _t.OrderBy[1] }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <widget-pagination
    :total='Math.ceil(postCount / pageSize)' :current='curPage' @change='setPage' />
  <div v-if='postsLoading' style='margin-top: 3ex; margin-bottom: 3ex'>
    <div class='ui active centered inline loader'></div>
  </div>
  <div v-else v-for='post in posts' :key='post.id'>
    <widget-post-preview :post='post' />
  </div>
  <widget-pagination
    :total='Math.ceil(postCount / pageSize)' :current='curPage' @change='setPage' />
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import WidgetPagination from './WidgetPagination';
import WidgetPostPreview from './WidgetPostPreview';
import { request } from '../utils/api';
import EventBus from '../utils/event-bus';
import { _t } from '../utils/i18n';

export default {
  name: 'PagePosts',
  components: {
    WidgetPagination,
    WidgetPostPreview,
  },
  async setup() {
    onMounted(() => EventBus.emit('routerViewLoaded'));

    const route = useRoute();
    const router = useRouter();

    const postsLoading = ref(true);
    const postCount = ref(0);
    const curPage = ref(1);
    const pageSize = 10;

    const posts = ref([]);
    const filterUser = ref(null);

    const updateFilterUser = async (route) => {
      const id = route.params.uid;
      if (id !== undefined) {
        const [status, body] = await request(
          'GET', `/user/${id}`, {});
        if (status >= 200 && status < 299) {
          filterUser.value = {
            id: body.id,
            nickname: body.nickname
          };
        }
      } else {
        filterUser.value = null;
      }
    };

    const orderBy = ref(0);

    const updatePosts = async () => {
      postsLoading.value = true;

      const params = {
        page: curPage.value,
        size: pageSize,
        orderByReply: (orderBy.value === 0),
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

      postsLoading.value = false;
    };

    // XXX: Workaround only!! vue-router might have been misbehaving
    // TODO: Research and report to vue-router if confirmed and no dupliate
    // If a vue-router upgrade breaks, update or remove as appropriate
    let _query = route.query;
    const getQuery = () => _query;
    const replaceQuery = (query) => {
      // router.replace({ query });
      let queryStr = '';
      for (const [k, v] of Object.entries(query))
        queryStr += (queryStr ? '&' : '') + k + '=' + encodeURIComponent(v);
      window.history.replaceState(
        Object.assign(window.history.state, {
          current: route.fullPath.split('?')[0] + '?' + queryStr
        }),
        '', '?' + queryStr);
      _query = query;
    };

    const setOrderBy = async (s, keepRoute) => {
      if (keepRoute || orderBy.value !== s) {
        orderBy.value = s;
        if (!keepRoute) {
          const query = Object.assign({}, getQuery());
          if (s === 0) delete query.order;
          else query.order = s;
          replaceQuery(query);
          await updatePosts();
        }
      }
    };

    const setPage = async (p, keepRoute) => {
      if (keepRoute || curPage.value !== p) {
        curPage.value = p;
        if (!keepRoute) {
          const query = Object.assign({}, getQuery());
          query.page = p;
          replaceQuery(query);
          await updatePosts();
        }
      }
    };

    watch(route, async (_n, _o) => {
      if (Number(route.params.uid || -1) !==
          (filterUser.value || { id: -1 }).id) {
        await updateFilterUser(route);
        await setOrderBy(Number(route.query.order || 0), true);
        await setPage(Number(route.query.page || 1), true);
        await updatePosts();
        EventBus.emit('routerViewLoaded');
      }
    });

    await updateFilterUser(route);
    await setOrderBy(Number(route.query.order || 0), true);
    await setPage(Number(route.query.page || 1), true);
    await updatePosts();

    return {
      _t,

      postsLoading,
      postCount,
      curPage,
      posts,
      filterUser,

      orderBy,
      setOrderBy,

      pageSize,
      setPage,

      updatePosts,
    };
  }
}
</script>

<style scoped>
</style>
