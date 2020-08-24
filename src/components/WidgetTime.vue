<template>
  <span :data-tooltip='absolute'>
    {{ intuitive }}
  </span>
</template>

<script>
import { ref, watchEffect } from 'vue';

import moment from '../../node_modules/moment/dist/moment.js';
import zhLocale from '../../node_modules/moment/dist/locale/zh-cn.js';

export default {
  name: 'WidgetTime',
  props: ['time'],
  setup(props) {
    const intuitive = ref('');
    const absolute = ref('');

    watchEffect(() => {
      const time = moment(props.time);
      const diff = moment().diff(time, 'hours');
      intuitive.value = (diff <= 20 ? time.fromNow() : time.calendar());
      absolute.value = time.format('L LTS');
    });

    return {
      intuitive,
      absolute,
    };
  }
};
</script>

<style scoped>
</style>
