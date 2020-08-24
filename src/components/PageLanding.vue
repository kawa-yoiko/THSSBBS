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
import { useRoute, useRouter } from 'vue-router';

import { request, setLocalJWT, getLocalUser } from '../utils/api';
import { emitNotification } from '../utils/notification';
import EventBus from '../utils/event-bus';

export default {
  name: 'PageLanding',
  async setup() {
    const inputUsername = ref('2018013379');
    const inputPassword = ref('937194');
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
        console.log(body);
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
</style>
