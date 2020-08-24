<template>
  <router-link :to='"/user/" + user.id'
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
