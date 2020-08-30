import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import App from './App.vue'
import PageLanding from './components/PageLanding.vue'
import PagePosts from './components/PagePosts.vue'
import PagePost from './components/PagePost.vue'
import PageSaved from './components/PageSaved.vue'

import EventBus from './utils/event-bus'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: PageLanding },
    { path: '/login', component: PageLanding },
    { path: '/posts', component: PagePosts },
    { path: '/posts/by/:uid(\\d+)', component: PagePosts },
    { path: '/post/:id(\\d+|create)', component: PagePost },
    { path: '/saved', component: PageSaved },
  ],
  async scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      await EventBus.wait('routerViewLoaded', 0);
      return savedPosition;
    } else {
      return { left: 0, top: 0 };
    }
  },
})

const app = createApp(App)
app.use(router)
app.mount('#app')
