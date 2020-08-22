<template>
  <div>Landing page</div>
  <div>{{ responseText }}</div>
  <button @click="qwq">Button</button>
  <button @click="quq">hello</button>
  <router-link to="/hello">hello</router-link>
</template>

<script>
import { ref } from 'vue';
import ax from '../axios-instance';
import { useRouter } from 'vue-router';

export default {
  name: 'LandingPage',
  setup() {
    const responseText = ref('no response');
    const router = useRouter();
    const qwq = () => {
      ax.get('/hello')
        .then((resp) => responseText.value = resp.data);
      ax.get('/hello/v1/hello-user')
        .then((resp) => console.log('data', resp.data))
        .catch((err) => console.log('error', err.response.status));
    };
    const quq = () => {
      router.push('/hello');
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
