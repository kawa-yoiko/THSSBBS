<template>
  <span :data-tooltip='absolute'>
    {{ intuitive }}
  </span>
</template>

<script>
import { ref, watchEffect } from 'vue';

import moment from '../../node_modules/moment/dist/moment.js';
import zhLocale from '../../node_modules/moment/dist/locale/zh-cn.js';

import { _t } from '../utils/i18n';

export default {
  name: 'WidgetTime',
  props: ['time', 'prefix'],
  setup(props) {
    const intuitive = ref('');
    const absolute = ref('');

    const normalize = (s) => {
      const charType = (c) => (c <= 32 ? 0 : (c <= 127 ? 1 : -1));
      let t = s[0];
      let x = charType(s.charCodeAt(0));
      for (let i = 1; i < s.length; i++) {
        const y = charType(s.charCodeAt(i));
        if ((x ^ y) === -2) t += ' ';
        t += s[i];
        x = y;
      }
      return t;
    };

    watchEffect(() => {
      moment.locale(_t.value.MomentJSLocale);
      const time = moment(props.time);
      const diff = moment().diff(time, 'hours');
      const s = (props.prefix || '') +
        (diff <= 20 ? time.fromNow() : time.calendar());
      intuitive.value = normalize(s);
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
