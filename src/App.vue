<template>
  <layout-header></layout-header>
  <div class='ui three column grid'>
    <div class='two wide column'></div>
    <div id='main' class='nine wide column'>
      <Suspense>
        <template #default>
          <router-view />
        </template>
        <template #fallback>
          loading
        </template>
      </Suspense>
    </div>
    <div class='three wide column' style='background: rgba(216, 216, 216, 0.8)'></div>
    <div class='two wide column'></div>
  </div>
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
@import './assets/Semantic-UI-CSS/semantic.min.css';

body {
  font-family: 'Open Sans', sans-serif;
  font-size: 18px;
  color: #333;
  background: #fffdfd;
  margin-top: 30px;

  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#main {
  margin-bottom: 60px;
}

:not(span):not(i) {
  font-family: 'Open Sans', sans-serif !important;
  letter-spacing: 0.5px;
  line-height: 1.5;
}
:not(span):not(i):not(.mini) {
  font-size: 18px;
}

i.icon {
  font-family: Icons !important;
}

.ui.input input:focus,
.ui.form textarea:focus,
.ui.form input:focus {
  border-color: #f2711c !important;
}
</style>
