<template>
  <h1>登录</h1>
  <div class='ui form'>
    <input v-model='inputUsername' placeholder='用户名' />
    <input v-model='inputPassword' placeholder='密码' type='password' />
  </div>
  <button :class='"ui fluid orange button" +
    (logInInProgress ? " loading disabled" : "")'
    @click='logIn'>Log In</button>
</template>

<script>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { request, setLocalJWT, getLocalUser } from '../utils/api';
import { emitNotification } from '../utils/notification';
import EventBus from '../utils/event-bus';

export default {
  name: 'PageLanding',
  async setup() {
    const inputUsername = ref('20180');
    const inputPassword = ref('');
    const logInInProgress = ref(false);

    const route = useRoute();
    const returnDest = route.query.return || '/posts';

    const router = useRouter();
    if (await getLocalUser() !== null) {
      router.replace(returnDest);
      return;
    }

    const logIn = async () => {
      logInInProgress.value = true;

      const [status, body] = await request('PATCH', '/login', {
          username: inputUsername.value,
          password: inputPassword.value,
        },
        null  // No authorization
      );

      logInInProgress.value = false;

      if (status >= 200 && status < 299) {
        setLocalJWT(body.jwt);
        router.replace(returnDest);
        EventBus.emit('logged-in');
      } else if (status >= 400 && status < 499) {
        emitNotification(body);
      } else {
        emitNotification(body); // Should be marked as unknown
      }
    };

    return {
      inputUsername,
      inputPassword,
      logInInProgress,

      logIn,
    };
  }
};
</script>

<style scoped>
div.ui.form input,
button.ui.fluid.button {
  margin: 1ex 0;
}
</style>
