(() => {
  "use strict";

  const canvas = document.getElementById("starfield");
  const ctx = canvas.getContext("2d");
  const dialog = document.getElementById("birthdayDialog");
  const toast = document.getElementById("toast");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let stars = [];
  let toastTimer;

  // Lightweight, responsive star background.
  function makeStars() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.min(100, Math.floor((window.innerWidth * window.innerHeight) / 12000));
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      radius: Math.random() * 1.2 + 0.25,
      alpha: Math.random() * 0.55 + 0.15,
      phase: Math.random() * Math.PI * 2
    }));
    drawStars(0);
  }

  function drawStars(time) {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    stars.forEach((star) => {
      const pulse = reduceMotion ? 1 : 0.72 + Math.sin(time * 0.0007 + star.phase) * 0.28;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(231, 219, 255, ${star.alpha * pulse})`;
      ctx.fill();
    });
    if (!reduceMotion) window.requestAnimationFrame(drawStars);
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2800);
  }

  function launchConfetti() {
    if (reduceMotion) {
      showToast("Happy Birthday, Rohan! ✨");
      return;
    }
    const colors = ["#c5a9ff", "#f4a8d4", "#f7d99b", "#a7e5c2", "#ffffff"];
    const amount = window.innerWidth < 600 ? 75 : 130;
    for (let i = 0; i < amount; i += 1) {
      const piece = document.createElement("span");
      piece.className = "confetti-piece";
      piece.style.left = `${Math.random() * 100}vw`;
      piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      piece.style.width = `${Math.random() * 6 + 5}px`;
      piece.style.height = `${Math.random() * 9 + 7}px`;
      piece.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
      piece.style.setProperty("--duration", `${2.4 + Math.random() * 2.8}s`);
      piece.style.setProperty("--drift", `${Math.random() * 180 - 90}px`);
      piece.style.animationDelay = `${Math.random() * 0.6}s`;
      document.body.appendChild(piece);
      window.setTimeout(() => piece.remove(), 6000);
    }
    showToast("A little birthday magic for Rohan ✦");
  }

  document.getElementById("openWish").addEventListener("click", () => {
    if (typeof dialog.showModal === "function") dialog.showModal();
    else document.getElementById("letter").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  });

  document.getElementById("closeDialog").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });

  document.getElementById("celebrateBtn").addEventListener("click", launchConfetti);
  document.getElementById("dialogCelebrate").addEventListener("click", () => {
    dialog.close();
    launchConfetti();
  });

  document.getElementById("wishBtn").addEventListener("click", () => {
    document.getElementById("wishConfirmation").hidden = false;
    launchConfetti();
    document.getElementById("wishBtn").textContent = "✦ Wish sent";
  });

  window.addEventListener("resize", makeStars, { passive: true });
  makeStars();
})();
