<template>
  <layout-header></layout-header>
  <hr>
  <Suspense>
    <template #default>
      <router-view />
    </template>
    <template #fallback>
      loading
    </template>
  </Suspense>
</template>

<script>
import LayoutHeader from './components/LayoutHeader.vue'

export default {
  name: 'App',
  setup() {
  },
  components: {
    LayoutHeader,
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
