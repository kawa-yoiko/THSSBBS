<template>
  <layout-header></layout-header>
  <div class='ui three column divided grid'>
    <div class='two wide column'></div>
    <div id='main' class='nine wide column' style='min-height: 400px'>
      <Suspense>
        <template #default>
          <router-view />
        </template>
        <template #fallback>
          <div style='width: 100%; margin-top: 6ex'>
            <div class='ui active loader'></div>
          </div>
        </template>
      </Suspense>
    </div>
    <div class='three wide column' style='background: rgba(216, 216, 216, 0.1)'>
      <widget-sidebar />
    </div>
    <div class='two wide column'></div>
  </div>
</template>

<script>
import LayoutHeader from './components/LayoutHeader.vue'
import WidgetSidebar from './components/WidgetSidebar.vue'

export default {
  name: 'App',
  setup() {
  },
  components: {
    LayoutHeader,
    WidgetSidebar,
  }
}
</script>

<style>
@import './assets/Semantic-UI-CSS/semantic.min.css';

body {
  font-family: 'Open Sans', sans-serif;
  font-size: 18px;
  color: #333;
  background: #fcfafa;
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
:not(span):not(i):not(.mini):not(h1):not(h2):not(h3):not(h4) {
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

/* Highlighting */
@import '../node_modules/highlight.js/styles/rainbow.css';

.post-content pre, .post-content code,
.post-content-preview pre, .post-content-preview code
{
  font-family: 'Source Code Pro', monospace !important;
}

.post-content pre,
.post-content-preview pre
{
  padding: 1ex 1em;
  border-radius: 6px;
  /* Match this with the theme used */
  background: #474949;
  color: #d1d9e1;
}
</style>
