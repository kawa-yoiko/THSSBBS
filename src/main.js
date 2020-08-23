import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import App from './App.vue'
import HelloWorld from './components/HelloWorld.vue'
import PageLanding from './components/PageLanding.vue'
import PagePosts from './components/PagePosts.vue'
import PagePost from './components/PagePost.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: PageLanding },
    { path: '/posts', component: PagePosts },
    { path: '/post/:id', component: PagePost },
    { path: '/hello', component: HelloWorld },
  ],
})

const app = createApp(App)
app.use(router)
app.mount('#app')
