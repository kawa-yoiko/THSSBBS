<template>
  THSSBBS
  user: {{ user }}
  <button v-if='user !== null' @click='logOut'>Log Out</button>
</template>

<script>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { request, getLocalJWT, setLocalJWT, getLocalUser } from '../utils/api';
import EventBus from '../utils/event-bus';

export default {
  name: 'LayoutHeader',
  setup() {
    const user = ref(null);

    // Refresh display on change
    const updateProfileDisp = async () => {
      user.value = await getLocalUser();
    };
    EventBus.on('logged-in', updateProfileDisp);
    EventBus.on('logged-out', updateProfileDisp);

    // Go back to log in page on log-out
    const route = useRoute();
    const router = useRouter();
    EventBus.on('logged-out', () => {
      if (route.fullPath !== '/' && route.fullPath !== '/login') {
        const ret = route.query.return || route.fullPath;
        router.replace({ path: '/login', query: { return: ret } });
      }
    });

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
      const [status, body] = await request(
        'PATCH', '/logout', {}, prevJWT);
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
