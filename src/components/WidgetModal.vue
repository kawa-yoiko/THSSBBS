<template>
  <div :class='"modal" + (visible ? " visible" : "")'
      ref='outer' @click='checkAndHide'>
    <div class='modal-content'>
      <slot v-if='visibleReally' />
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue';

export default {
  name: 'WidgetModal',
  setup() {
    const visible = ref(false);
    const outer = ref(null);

    const show = () => visible.value = true;
    const hide = () => visible.value = false;

    const checkAndHide = (e) => {
      if (e.target === outer.value) hide();
    };

    const visibleReally = ref(false);
    watch(visible, (newVisible, oldVisible) => {
      if (newVisible)
        visibleReally.value = true;
      else
        setTimeout(() => visibleReally.value = false, 300);
    });

    return {
      visible,
      outer,
      show,
      hide,
      checkAndHide,
      visibleReally,
    };
  }
};
</script>

<style scoped>
/* https://webdesign.tutsplus.com/tutorials/how-to-build-flexible-modal-dialogs-with-html-css-and-javascript--cms-33500 */
.modal {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(128, 128, 128, 0.7);
  visibility: hidden;
  opacity: 0;
  transition: all 0.2s ease-out;
  z-index: 999;
}

.modal.visible {
  visibility: visible;
  opacity: 1;
}

.modal-content {
  position: relative;
  max-width: 900px;
  max-height: 80vh;
  border-radius: 5px;
  background: #fffffe;
  overflow: auto;
  padding: 1.5ex 1.5em;
  z-index: 1000;
  top: -6px;
  transition: top 0.2s ease-out;
}

.modal.visible .modal-content {
  top: 0;
}
</style>
