<template>
  THSSBBS
  user: {{ user }}
  <button v-if='user !== null' @click='logOut'>Log Out</button>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { request, getLocalJWT, setLocalJWT, getLocalUser }
  from '../axios-instance';
import EventBus from '../event-bus';

export default {
  name: 'GlobalHeader',
  setup() {
    const user = ref(null);

    // Refresh display on change
    const updateProfileDisp = async () => {
      user.value = await getLocalUser();
    };
    EventBus.on('logged-in', updateProfileDisp);
    EventBus.on('logged-out', updateProfileDisp);

    // Go back to log in page on log-out
    const router = useRouter();
    EventBus.on('logged-out', () => router.push('/'));

    // Confirm validity of the auth token
    (async () => {
      user.value = await getLocalUser();
      if (user.value === null) EventBus.emit('logged-out');
    })().then();

    // Log out method
    const logOut = async () => {
      EventBus.emit('logged-out');
      const prevJWT = getLocalJWT();  // Save the token to be invalidated
      setLocalJWT(null);
      await updateProfileDisp();
      // Network request goes at the end
      // since other updates do not need to wait for its completion
      const [status, data] = await request(
        'PATCH', '/logout', {}, undefined, prevJWT);
    };

    return {
      user,

      logOut,
    };
  }
}
</script>

<style scoped>
</style>
