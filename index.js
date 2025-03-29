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

AFRAME.registerComponent("sabae-game", {
  schema: {
    holeIndex: { type: "int" },
  },

  init: function() {
    const dogg = this.el;
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

    dogg.addEventListener("grab-start", () => {
      if (isVisible && !isGrabbed) {
        isGrabbed = true;
        hideDogg();
        successSound.components.sound.playSound();
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

window.addEventListener("DOMContentLoaded", () => {
  startGame();
});
