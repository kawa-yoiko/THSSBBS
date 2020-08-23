import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import App from './App.vue'
import HelloWorld from './components/HelloWorld.vue'
import PageLanding from './components/PageLanding.vue'
import PagePosts from './components/PagePosts.vue'
import PagePost from './components/PagePost.vue'

import EventBus from './utils/event-bus'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: PageLanding },
    { path: '/posts', component: PagePosts },
    { path: '/post/:id(\\d+|create)', component: PagePost },
    { path: '/hello', component: HelloWorld },
  ],
  async scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      await EventBus.wait('routerViewLoaded', 5000);
      console.log(savedPosition);
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  },
})

const app = createApp(App)
app.use(router)
app.mount('#app')
