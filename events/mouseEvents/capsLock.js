// The `mouseEvent getModifierState()` is used to return a boolean value that indicates whether the specified modifier key is activated or not. The modifiers such as CapsLock, ScrollLock and NumLock are activated when they are clicked, and deactivated when they are clicked again.

// Let's take an input element to detect the CapsLock on/off behavior with an example,

// <input type="password" onmousedown="enterInput(event)" />

// <p id="feedback"></p>

function enterInput(e) {
  var flag = e.getModifierState("CapsLock");
  document.getElementById("feedback").innerHTML = flag
    ? "CapsLock activated"
    : "CapsLock not activated";
}
