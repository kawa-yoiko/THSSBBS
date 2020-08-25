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
          style='width: 50%' v-if='!inputting' @click='focusInput'>
        {{ cur }} / {{ total }}
      </button>
      <div class='ui mini compact input'
          :style='"width: 50%" + (inputting ? "" : "; display: none")'>
        <input type='number' inputmode='numeric'
          ref='pageInput' @blur='blurInput' @keyup.enter='blurInput'
          style='font-size: 0.8rem; text-align: center; padding: 0'>
      </div>
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

    const pageInput = ref(null);
    const inputting = ref(false);
    const focusInput = () => {
      inputting.value = true;
      pageInput.value.value = cur.value.toString();
      setTimeout(() => {
        pageInput.value.focus();
        pageInput.value.select();
      }, 10);
    };
    const blurInput = () => {
      inputting.value = false;
      const num = Number(pageInput.value.value);
      if (num >= 1 && num <= props.total)
        cur.value = num;
    };

    return {
      cur,
      pageInput,
      inputting,
      focusInput,
      blurInput,
    };
  }
};
</script>

<style>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type=number] {
  -moz-appearance: textfield;
}
</style>
