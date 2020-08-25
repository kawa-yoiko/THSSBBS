<template>
  <router-link to='/post/create'
      class='ui labeled icon orange large fluid button'>
    <i class='plus icon'></i>
    Create post
  </router-link>
  <div style='margin-top: 0' class='ui three column grid'>
    <div class='six wide column'>
      <button class='ui small basic icon button' @click='updatePosts'>
        <i class='ui sync alternate icon'></i>
      </button>
      <span style='margin-left: 0.5em;
          position: absolute; bottom: 2ex;
          font-size: 1.2rem; font-weight: bold'>
        最近帖子</span>
    </div>
    <div class='ten wide column'>
      <div class='ui right floated mini compact menu'>
        <router-link class='ui mini link item'
            v-if='filterUser !== null'
            to='/posts'>
          发布者：<span style='font-weight: bold'>{{ filterUser.nickname }}</span>
          <i class='x icon' style='margin: 0 0 0 0.35714286em'></i>
        </router-link>
        <div class='ui mini simple dropdown item'>
          {{ orderByDescription[orderBy] }}
          <i class='dropdown icon'></i>
          <div class='menu'>
            <div class='item' @click='setOrderBy(0)'>{{ orderByDescription[0] }}</div>
            <div class='item' @click='setOrderBy(1)'>{{ orderByDescription[1] }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <widget-pagination
    :total='Math.ceil(postCount / pageSize)' :current='curPage' @change='setPage' />
  <div v-if='postsLoading' style='margin-top: 3ex'>
    <div class='ui active centered inline loader'></div>
  </div>
  <div v-else v-for='post in posts' :key='post.id'
      class='ui card post-content-card'>
    <router-link :to='"/post/" + post.id' style='color: unset'>
    <div style=''>
      <p style='margin-bottom: 0.75ex; font-weight: bold'>
        <span v-if='post.title'>{{ post.title }}</span>
        <span v-else  style='color: #aaa'>(Untitled)</span>
        <span style='color: #aaa; margin-left: 0.5em'>#{{ post.id }}</span>
      </p>
      <div class='post-content-preview' v-html='parseContent(post.content)'>
      </div>
      <div class='post-content-preview-shadow'></div>
      <p style='color: #aaa'>
        <widget-user-badge :user='post.user' />
        <span style='margin: 0 0.25em'></span>
        <widget-time :time='post.createdAt' prefix='发布于' />
        <span v-if='post.lastRepliedAt > post.createdAt'>
          <br>
          <widget-user-badge :user='post.lastReplyUser' />
          <span style='margin: 0 0.25em'></span>
          <widget-time :time='post.lastRepliedAt' prefix='活动于' />
        </span>
      </p>
    </div>
    </router-link>
    <br>
  </div>
  <widget-pagination
    :total='Math.ceil(postCount / pageSize)' :current='curPage' @change='setPage' />
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import WidgetUserBadge from './WidgetUserBadge';
import WidgetTime from './WidgetTime';
import WidgetPagination from './WidgetPagination';
import { request } from '../utils/api';
import EventBus from '../utils/event-bus';
import parseContent from '../utils/parse-content';

export default {
  name: 'PagePosts',
  components: {
    WidgetUserBadge,
    WidgetTime,
    WidgetPagination,
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
    const orderByDescription = [ '按最近活动时间降序', '按主帖更新时间降序' ];

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

    const setOrderBy = async (s, keepRoute) => {
      if (keepRoute || orderBy.value !== s) {
        orderBy.value = s;
        if (!keepRoute) {
          const query = Object.assign({}, route.query);
          if (s === 0) delete query.order;
          else query.order = s;
          router.replace({
            path: route.fullPath,
            query,
          });
          await updatePosts();
        }
      }
    };

    const setPage = async (p, keepRoute) => {
      if (keepRoute || curPage.value !== p) {
        curPage.value = p;
        if (!keepRoute) {
          const query = Object.assign({}, route.query);
          query.page = p;
          router.replace({
            path: route.fullPath,
            query,
          });
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
      postsLoading,
      postCount,
      curPage,
      posts,
      filterUser,

      orderBy,
      orderByDescription,
      setOrderBy,

      pageSize,
      setPage,

      updatePosts,
      parseContent,
    };
  }
}
</script>

<style scoped>
.post-content-preview {
  padding-bottom: 0.75ex;
  max-height: 210px;
  overflow: hidden;
}
.post-content-preview-shadow {
  width: 100%;
  height: 1ex;
  position: relative;
  top: -1ex;
  margin-bottom: -1ex;
  background: linear-gradient(transparent, #fffefd);
  transition: background ease-out 0.1s;
}

.post-content-card {
  background: #fffefd;
  width: 100%;
  padding: 1ex 1em;
  transition: background ease-out 0.1s;
}
.post-content-card:hover {
  background: #ffffff;
}
.post-content-card:hover .post-content-preview-shadow {
  background: linear-gradient(transparent, #ffffff);
}
</style>
