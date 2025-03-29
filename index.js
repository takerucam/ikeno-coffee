'use strict';

let a = 2;

let score = 0;
let timeLeft = 30;
let timerInterval = null;

function startGame() {
  score = 0;
  timeLeft = 30;
  updateScore();
  updateTimer();

  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimer();

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      endGame();
    }
  }, 1000);
}

function updateScore() {
  const scoreText = document.querySelector("#score-text");
  scoreText.setAttribute("value", `Score: ${score}`);
}

function updateTimer() {
  const timerText = document.querySelector("#timer-text");
  timerText.setAttribute("value", `Time: ${timeLeft}`);
}

function endGame() { }

// // WebXRのセッション開始時にPassthroughを有効化
// AFRAME.registerComponent('passthrough-start', {
//   init: function () {
//     this.el.sceneEl.addEventListener('enter-vr', () => {
//       if (navigator.xr) {
//         navigator.xr.requestSession('immersive-ar', { requiredFeatures: ['passthrough'] })
//           .then(session => {
//             console.log('Passthrough enabled');
//           })
//           .catch(err => console.error('Passthrough failed', err));
//       }
//     });
//   }
// });

// document.querySelector('a-scene').setAttribute('passthrough-start', '');

// A-Frame用のコンポーネントを登録
if (typeof AFRAME !== 'undefined') {
  // 掴んだ時のサウンドコンポーネント
  // AFRAME.registerComponent('hand-aware-sound', {
  //   init: function() {
  //     let el = this.el;

  //     // サウンドエンティティへの参照を取得
  //     const leftHandSound = document.querySelector("#left-hand-sound");
  //     const rightHandSound = document.querySelector("#right-hand-sound");

  //     // 掴まれた時のイベント
  //     el.addEventListener('grabstart', function(evt) {
  //       // イベントから掴んだ手のエンティティを取得
  //       let handEl = evt.detail.hand || evt.detail.target || evt.detail;

  //       try {
  //         // 手のIDまたは属性から左右を判定
  //         if (handEl.id === 'leftHand' ||
  //             (handEl.getAttribute('hand-tracking-grab-controls') &&
  //              handEl.getAttribute('hand-tracking-grab-controls').hand === 'left')) {
  //           console.log('Grabbed by LEFT hand');
  //           leftHandSound.components.sound.playSound();
  //         } else if (handEl.id === 'rightHand' ||
  //                   (handEl.getAttribute('hand-tracking-grab-controls') &&
  //                    handEl.getAttribute('hand-tracking-grab-controls').hand === 'right')) {
  //           console.log('Grabbed by RIGHT hand');
  //           rightHandSound.components.sound.playSound();
  //         } else {
  //           console.log('Grabbed by unknown hand');
  //         }
  //       } catch (error) {
  //         console.error('Error playing sound:', error);
  //       }
  //     });
  //   }
  // });


  AFRAME.registerComponent("sabae-game", {
    schema: {
      holeIndex: { type: "int" },
    },

    init: function() {
      const dogg = document.querySelector("#dogg-hole")
      const successSound = document.querySelector("#success-sound");
      const failSound = document.querySelector("#fail-sound");
      const frySound = document.querySelector("#fry-sound");

      let isGrabbed = false;
      let isVisible = false;
      const basePosition = Object.assign({}, dogg.getAttribute("position")); // ← ここ重要！

      function showDogg() {
        isGrabbed = false;
        isVisible = true;

        frySound.components.sound.playSound();

        dogg.setAttribute("animation", {
          property: "position",
          to: `${basePosition.x} ${basePosition.y + 1.5} ${basePosition.z}`,
          dur: 300,
          easing: "easeOutQuad",
        });

        setTimeout(() => {
          if (!isGrabbed) {
            hideDogg();
            failSound.components.sound.playSound();
          }
        }, 2000);
      }

      function hideDogg() {
        isVisible = false;

        dogg.setAttribute("animation", {
          property: "position",
          to: `${basePosition.x} ${basePosition.y} ${basePosition.z}`,
          dur: 300,
          easing: "easeInQuad",
        });
      }

       // 衝突イベントのリスナーを追加
      //  dogg.addEventListener('collide', (event) => {
      //   console.log('衝突が検出されました:', event);
      //   successSound.components.sound.playSound();

      //   // 衝突した相手のエンティティを正しく取得
      //   const collidingEntity = event.detail.body.el;

      //   console.log('衝突した相手:', collidingEntity ? collidingEntity.id : 'unknown');

      //   if (collidingEntity &&
      //       (collidingEntity.id === 'leftHand' || collidingEntity.id === 'rightHand') &&
      //       isVisible && !isGrabbed) {
      //     console.log(`Dogg hit by ${collidingEntity.id}`);
      //     isGrabbed = true;
      //     hideDogg();
      //     successSound.components.sound.playSound();

      //     // スコアを増加
      //     score += 1;
      //     updateScore();
      //   }
      // });

      // grabbable イベントのリスニング
    dogg.addEventListener('grabstart', (event) => {
      successSound.components.sound.playSound();
      console.log('dogg-hole が掴まれました:', event);

      // 掴んだ手のエンティティを取得
      const handEntity = event.detail.hand || event.detail.grabber;
      console.log('掴んだ手:', handEntity ? handEntity.id : 'unknown');

      if (handEntity &&
          (handEntity.id === 'leftHand' || handEntity.id === 'rightHand') &&
          isVisible && !isGrabbed) {
        console.log(`Dogg grabbed by ${handEntity.id}`);
        isGrabbed = true;
        hideDogg();
        successSound.components.sound.playSound();

        // スコアを増加
        score += 1;
        updateScore();
      }
    });

      setTimeout(() => {
        setInterval(
          () => {
            if (!isVisible && Math.random() < 0.5) {
              showDogg();
            }
          },
          2500 + Math.random() * 1000,
        );
      }, this.data.holeIndex * 800);
    },
  });
}




window.addEventListener("DOMContentLoaded", () => {
  startGame();
});
