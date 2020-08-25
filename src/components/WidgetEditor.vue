<template>
  <div :style='preview !== null ? "display: none" : ""'>
    <slot />
  </div>
  <div style='margin: 1ex 0 2ex 0' v-if='preview !== null'>
    <p style='margin-bottom: 0.75ex; font-size: 1.2rem; font-weight: bold'>预览</p>
    <div class='post-content' v-html='parseContent(preview)' />
  </div>
</template>

<script>
import parseContent from '../utils/parse-content';

export default {
  name: 'WidgetEditor',
  props: ['preview'],
  setup(props) {
    return {
      parseContent,
    };
  }
};
</script>

<style scoped>
</style>
