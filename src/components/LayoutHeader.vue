<template>
  <div class='ui top fixed borderless menu'>
    <widget-modal ref='notificationModal'>
      <div style='padding: 1.5ex 1em 2ex 1em'>
        <h3>{{ _t.Problem }}</h3>
        <p>{{ notificationText }}</p>
      </div>
    </widget-modal>

    <router-link class='item' to='/'>
      <span style='font-weight: bold'>THSSBBS</span>
    </router-link>
    <template v-if='user !== null'>
      <router-link class='item' to='/posts'>
        <span>{{ _t.Posts }}</span>
      </router-link>
      <router-link class='item' to='/saved'>
        <span>{{ _t.Saved }}</span>
      </router-link>
      <div class='right menu'>
        <div class='ui simple dropdown item'>
          <router-link 
              style='color: #333'
              :to='"/posts/by/" + user.id'>
            <span>{{ user.nickname }}</span>
          </router-link>
          <div class='menu'>
            <router-link class='link item'
                :to='"/posts/by/" + user.id'>
              <i class='ui folder open outline icon'></i>{{ _t.MyPosts }}
            </router-link>
            <!-- NOTE:
              "Unhandled error during execution of scheduler flush. This is likely a Vue internals bug."
              happens if this is also a link to /posts/by/uid -->
            <button class='item'
                @click='logOut'>
              <i class='ui sign out icon'></i>{{ _t.LogOut }}
            </button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import WidgetModal from './WidgetModal';
import { request, getLocalJWT, setLocalJWT, getLocalUser } from '../utils/api';
import EventBus from '../utils/event-bus';
import { setNotificationHandlers } from '../utils/notification';
import { _t } from '../utils/i18n';

export default {
  name: 'LayoutHeader',
  components: { WidgetModal },
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

    // Notifiation modal dialogue
    const notificationModal = ref(null);
    const notificationText = ref('');
    onMounted(() => setNotificationHandlers(
      notificationModal, notificationText));

    return {
      _t,

      user,
      logOut,

      notificationModal,
      notificationText,
    };
  }
}
</script>

<style scoped>
</style>
