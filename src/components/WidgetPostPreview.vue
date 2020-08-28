<template>
  <div class='ui card post-content-card'>
    <router-link :to='"/post/" + post.id' style='color: unset'>
    <div style=''>
      <p style='margin-bottom: 0.75ex; font-weight: bold'>
        <span v-if='post.title'>{{ post.title }}</span>
        <span v-else  style='color: #aaa'>(Untitled)</span>
        <span style='color: #aaa; margin-left: 0.5em'>#{{ post.id }}</span>
      </p>
      <div class='post-content-preview' v-html='parseContent(post.content)'>
      </div>
      <div class='post-content-preview-shadow'></div>
      <p style='color: #aaa'>
        <widget-user-badge :user='post.user' />
        <span style='margin: 0 0.25em'></span>
        <widget-time :time='post.createdAt' prefix='发布于' />
        <span v-if='post.lastRepliedAt > post.createdAt'>
          <br>
          <template v-if='post.lastReplyUser !== null'>
            <widget-user-badge :user='post.lastReplyUser' />
            <span style='margin: 0 0.25em'></span>
          </template>
          <widget-time :time='post.lastRepliedAt' prefix='活动于' />
        </span>
      </p>
    </div>
    </router-link>
  </div>
</template>

<script>
import WidgetUserBadge from './WidgetUserBadge';
import WidgetTime from './WidgetTime';
import parseContent from '../utils/parse-content';

export default {
  name: 'WidgetPostPreview',
  props: ['post'],
  components: {
    WidgetUserBadge,
    WidgetTime,
  },
  setup() {
    return {
      parseContent,
    };
  }
}
</script>

<style scoped>
.post-content-preview {
  padding-bottom: 0.75ex;
  max-height: 210px;
  overflow: hidden;
}
.post-content-preview-shadow {
  width: 100%;
  height: 1ex;
  position: relative;
  top: -1ex;
  margin-bottom: -1ex;
  background: linear-gradient(transparent, #fdfbfb);
  transition: background ease-out 0.1s;
}

.post-content-card {
  background: #fefcfc;
  width: 100%;
  padding: 1ex 1em;
  transition: background ease-out 0.1s;
  margin: 1.5ex 0 !important;
}
.post-content-card:hover {
  background: #ffffff;
}
.post-content-card:hover .post-content-preview-shadow {
  background: linear-gradient(transparent, #ffffff);
}
</style>
