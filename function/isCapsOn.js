//HTML
<input type="email" id="email" />;

//Javascript
const isCapslock = (e) => {
  const IS_MAC = /Mac/.test(navigator.platform);

  const charCode = e.charCode;
  const shiftKey = e.shiftKey;

  if (charCode >= 97 && charCode <= 122) {
    capsLock = shiftKey;
  } else if (charCode >= 65 && charCode <= 90 && !(shiftKey && IS_MAC)) {
    capsLock = !shiftKey;
  }

  return capsLock;
};

const emailInput = document.querySelector("#email");

emailInput.addEventListener("keypress", function (event) {
  if (isCapslock(event)) {
    console.log("caps lock is on");
  } else {
    console.log("caps lock is off");
  }
});

/************************** */
//HTML
<input type="email" id="email" />;

//Javascript
const emailInput = document.querySelector("#email");

emailInput.addEventListener("keypress", function (event) {
  if (event.getModifierState && event.getModifierState("CapsLock")) {
    console.log("caps lock is on");
  } else {
    console.log("caps lock is off");
  }
});
