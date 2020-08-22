<template>
  <global-header></global-header>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <router-view />
  </div>
</template>

<script>
import GlobalHeader from './components/GlobalHeader.vue'
import HelloWorld from './components/HelloWorld.vue'
import LandingPage from './components/LandingPage.vue'

export default {
  name: 'App',
  setup() {
  },
  components: {
    GlobalHeader,
    HelloWorld,
    LandingPage
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
