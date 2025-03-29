console.log("hello vr");
 // WebXRのセッション開始時にPassthroughを有効化
 AFRAME.registerComponent('passthrough-start', {
  init: function () {
    this.el.sceneEl.addEventListener('enter-vr', () => {
      if (navigator.xr) {
        navigator.xr.requestSession('immersive-ar', { requiredFeatures: ['passthrough'] })
          .then(session => {
            console.log('Passthrough enabled');
          })
          .catch(err => console.error('Passthrough failed', err));
      }
    });
  }
});

document.querySelector('a-scene').setAttribute('passthrough-start', '');