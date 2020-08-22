<template>
  <div>Landing page</div>
  <div>{{ responseText }}</div>
  <button @click="qwq">Button</button>
  <button @click="quq">Button</button>
</template>

<script>
import { ref } from 'vue';
import ax from '../axios-instance';

export default {
  name: 'LandingPage',
  setup() {
    const responseText = ref('no response');
    const qwq = () => {
      ax.get('/hello')
        .then((resp) => console.log(responseText.value = resp.data));
    };
    const quq = () => {
    };

    return {
      responseText,
      qwq,
      quq,
    };
  }
};
</script>

<style scoped>
</style>
