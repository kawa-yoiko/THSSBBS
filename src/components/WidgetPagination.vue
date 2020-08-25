<template>
  <div style='margin-top: 1.5ex'>
    <div class='ui mini basic twelve icon buttons'>
      <button class='ui mini basic icon button' @click='cur = 1'>
        <i class='angle step backward icon'></i></button>
      <button class='ui mini basic icon button' @click='cur = Math.max(1, cur - 10)'>
        <i class='angle double left icon'></i></button>
      <button class='ui mini basic icon button' @click='cur = Math.max(1, cur - 1)'>
        <i class='angle left icon'></i></button>
      <button class='ui fluid mini basic button'
          style='width: 50%'>
        {{ cur }} / {{ total }}
      </button>
      <button class='ui mini basic icon button' @click='cur = Math.min(total, cur + 1)'>
        <i class='angle right icon'></i></button>
      <button class='ui mini basic icon button' @click='cur = Math.min(total, cur + 10)'>
        <i class='angle double right icon'></i></button>
      <button class='ui mini basic icon button' @click='cur = total'>
        <i class='angle step forward icon'></i></button>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue';

export default {
  name: 'WidgetPagination',
  props: ['total', 'current', 'onChange'],
  setup(props) {
    const cur = ref(props.current);

    watch(props, (n, o) => cur.value = n.current);
    watch(cur, (n, o) => {
      if (o !== n) props.onChange.call(undefined, n);
    });

    return {
      cur,
    };
  }
};
</script>

<style>
</style>
