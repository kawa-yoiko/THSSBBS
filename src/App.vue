<template>
  <layout-header />
  <div class='ui three column divided grid'>
    <div class='two wide column'></div>
    <div id='main' class='nine wide column' style='min-height: 400px'>
      <Suspense>
        <template #default>
          <router-view />
        </template>
        <template #fallback>
          <div style='width: 100%; margin-top: 6ex'>
            <div class='ui active loader' style='z-index: 1'></div>
          </div>
        </template>
      </Suspense>
    </div>
    <div class='three wide column' style='background: rgba(216, 216, 216, 0.1)'>
      <layout-sidebar />
    </div>
    <div class='two wide column'></div>
  </div>
  <layout-footer />
</template>

<script>
import LayoutHeader from './components/LayoutHeader.vue'
import LayoutSidebar from './components/LayoutSidebar.vue'
import LayoutFooter from './components/LayoutFooter.vue'

export default {
  name: 'App',
  setup() {
  },
  components: {
    LayoutHeader,
    LayoutSidebar,
    LayoutFooter,
  }
}
</script>

<style>
@import './assets/Semantic-UI-CSS/semantic.min.css';
@import './assets/fonts.css';

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
  padding-bottom: 60px;
  background: #fffefd;
}

:not(span):not(i):not(pre):not(code) {
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
i.icon.outline {
  font-family: outline-icons !important;
}

.ui.input input:focus,
.ui.form textarea:focus,
.ui.form input:focus {
  border-color: #f2711c !important;
}

/* Highlighting */
@import '../node_modules/highlight.js/styles/rainbow.css';

pre, code {
  font-family: 'Source Code Pro', monospace !important;
}

pre {
  padding: 1ex 1em;
  border-radius: 6px;
  /* Match this with the theme used */
  background: #474949;
  color: #d1d9e1;
}

::-webkit-scrollbar * {
  background: transparent;
}
::-webkit-scrollbar-track {
  background: transparent !important;
}
::-webkit-scrollbar-thumb {
  background: rgba(255, 192, 64, 0.3) !important;
}
</style>
