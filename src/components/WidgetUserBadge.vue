<template>
  <router-link :to='"/posts/by/" + user.id'
      style='color: black'>
    {{ user.nickname }}
  </router-link>
</template>

<script>
export default {
  name: 'WidgetUserBadge',
  props: ['user'],
  setup(props) {
    return {
    };
  }
};
</script>

<style scoped>
</style>
