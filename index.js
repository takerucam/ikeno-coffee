console.log("hello vr");

AFRAME.registerComponent('foo', {
  init: function () {
    // Set up throttling.
    this.throttledFunction = AFRAME.utils.throttle(this.everySecond, 1000, this);
    AFRAME.utils.device.checkHeadsetConnected ()
    
  },

  everySecond: function () {
    // Called every second.
    console.log("A second passed.");
  },

  tick: function (t, dt) {
    this.throttledFunction();  // Called once a second.
    console.log("A frame passed.");  // Called every frame.
   },

});