<template>
  <router-link :to='"/posts/by/" + user.id'
    :style='{
      "font-weight": isOp ? "bold" : undefined,
      "color": isLocal ? "#f2711c" : "#333",
    }'>
    {{ user.nickname }}
  </router-link>
</template>

<script>
export default {
  name: 'WidgetUserBadge',
  props: ['user', 'isOp', 'isLocal'],
  setup(props) {
    return {
    };
  }
};
</script>

<style scoped>
</style>
