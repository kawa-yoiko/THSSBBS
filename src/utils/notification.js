let modal = null;
let textRef = null;

const setNotificationHandlers =
  (elm, text) => { modal = elm; textRef = text; };

const emitNotification = (message) => {
  if (modal) {
    textRef.value = message;
    modal.value.show();
  } else {
    alert(message);
  }
};

export {
  setNotificationHandlers,
  emitNotification,
};
