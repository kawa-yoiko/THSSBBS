<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <router-view />
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import LandingPage from './components/LandingPage.vue'
import EventBus from './event-bus';

export default {
  name: 'App',
  setup() {
    EventBus.on('logged-in', () => {
      console.log('logged in!');
    });
  },
  components: {
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
