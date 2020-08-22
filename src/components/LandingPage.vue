<template>
  <div>Landing page</div>
  <input v-model='inputUsername' placeholder='username' /><br>
  <input v-model='inputPassword' placeholder='password' type='password' /><br>
  <div v-if='logInInProgress'>
    sending request
  </div>
  <div v-else>
    <button @click='logIn'>Log In</button>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { request, setLocalJWT } from '../axios-instance';
import { emitNotification } from '../notification';
import EventBus from '../event-bus';

export default {
  name: 'LandingPage',
  setup() {
    const inputUsername = ref('2018013379');
    const inputPassword = ref('937194');
    const logInInProgress = ref(false);

    const router = useRouter();

    const logIn = async () => {
      logInInProgress.value = true;

      const [status, data] = await request('PATCH', '/login', {
          username: inputUsername.value,
          password: inputPassword.value,
        }, false,
        () => logInInProgress.value = false
      );

      if (status >= 200 && status < 299) {
        console.log(data);
        setLocalJWT(data.jwt);
        router.push('/hello');
        EventBus.emit('logged-in');
      } else if (status >= 400 && status < 499) {
        emitNotification(data);
      } else {
        emitNotification(data); // Should be marked as unknown
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
</style>
