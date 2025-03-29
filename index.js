'use strict';

let currentSound = null;

function playSound(url = '/assets/bgm/sample.mp3') {
  // 現在再生中の音があれば停止
  if (currentSound && currentSound.playing()) {
    currentSound.stop();
  }

  const sound = new Howl({
    src: [url],
    volume: 1.0,
  });
  console.log('play sound:', url);
  sound.play();

  // 現在の音を保存
  currentSound = sound;
}

// A-Frame用のコンポーネントを登録
if (typeof AFRAME !== 'undefined') {
  // オブジェクトが掴まれた時のコンポーネント - どちらの手で掴まれたかを検出
  AFRAME.registerComponent('hand-aware-sound', {
    schema: {
      leftHandSound: {type: 'string', default: '/assets/bgm/um.m4a'},
      rightHandSound: {type: 'string', default: '/assets/bgm/handan.m4a'}
    },

    init: function() {
      let el = this.el;
      let data = this.data;

      // 掴まれた時のイベント
      el.addEventListener('grabstart', function(evt) {
        // イベントから掴んだ手のエンティティを取得
        let handEl = evt.detail.hand || evt.detail.target || evt.detail;

        // 手のIDまたは属性から左右を判定
        if (handEl.id === 'leftHand' || handEl.getAttribute('hand-tracking-grab-controls').hand === 'left') {
          console.log('Grabbed by LEFT hand');
          playSound(data.leftHandSound);
        } else if (handEl.id === 'rightHand' || handEl.getAttribute('hand-tracking-grab-controls').hand === 'right') {
          console.log('Grabbed by RIGHT hand');
          playSound(data.rightHandSound);
        } else {
          console.log('Grabbed by unknown hand');
          // 左右不明の場合はデフォルトの音を再生
          playSound();
        }
      });
    }
  });
}

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
