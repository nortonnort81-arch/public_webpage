(function () {
  "use strict";

  const TOTAL_QUESTIONS = 10;
  const noMessages = [
    "Oops—too slow! Try the purple one.",
    "That button seems a little shy.",
    "Are you sure? It clearly disagrees.",
    "The NO button has left the chat.",
    "Nice try, Katieeeeeeee!",
    "Your heart knows which one to pick.",
    "I admire the determination, honestly.",
    "Plot twist: YES is still right there."
  ];

  const welcomeScreen = document.querySelector("#welcome-screen");
  const gameScreen = document.querySelector("#game-screen");
  const surpriseScreen = document.querySelector("#surprise-screen");
  const startButton = document.querySelector("#start-button");
  const yesButton = document.querySelector("#yes-button");
  const noButton = document.querySelector("#no-button");
  const answerZone = document.querySelector("#answer-zone");
  const questionLabel = document.querySelector("#question-label");
  const questionText = document.querySelector("#question-text");
  const questionNumber = document.querySelector("#question-number");
  const progress = document.querySelector("[role='progressbar']");
  const progressFill = document.querySelector("#progress-fill");
  const answerMessage = document.querySelector("#answer-message");

  let questions = [];
  let currentQuestion = 0;
  let noAttempts = 0;

  function shuffle(items) {
    const copy = [...items];
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
    }
    return copy;
  }

  function showScreen(screen) {
    [welcomeScreen, gameScreen, surpriseScreen].forEach((item) => {
      const active = item === screen;
      item.hidden = !active;
      item.classList.toggle("is-active", active);
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetNoButton() {
    const zoneWidth = answerZone.clientWidth;
    const buttonWidth = noButton.offsetWidth;
    const compactLayout = zoneWidth < 300;
    const left = compactLayout
      ? Math.max(8, (zoneWidth - buttonWidth) / 2)
      : Math.max(8, zoneWidth - buttonWidth - 24);

    noButton.style.left = `${left}px`;
    noButton.style.top = compactLayout ? "136px" : "64px";
  }

  function renderQuestion() {
    const question = questions[currentQuestion];
    const displayNumber = currentQuestion + 1;

    questionLabel.textContent = question.label;
    questionText.textContent = question.text;
    questionNumber.textContent = String(displayNumber);
    progress.setAttribute("aria-valuenow", String(displayNumber));
    progressFill.style.width = `${displayNumber * 10}%`;
    answerMessage.textContent = currentQuestion === 0
      ? "I believe in you."
      : "Excellent choice. Keep going!";

    yesButton.classList.remove("is-celebrating");
    yesButton.style.setProperty("--yes-scale", "1");
    noAttempts = 0;
    window.requestAnimationFrame(resetNoButton);
  }

  function startGame() {
    const pool = Array.isArray(window.ANNIVERSARY_QUESTIONS)
      ? window.ANNIVERSARY_QUESTIONS
      : [];
    const finalQuestion = window.ANNIVERSARY_FINAL_QUESTION;
    const randomizedQuestionCount = TOTAL_QUESTIONS - 1;

    if (
      pool.length < randomizedQuestionCount ||
      !finalQuestion ||
      typeof finalQuestion.text !== "string"
    ) return;

    questions = [
      ...shuffle(pool).slice(0, randomizedQuestionCount),
      finalQuestion
    ];
    currentQuestion = 0;
    showScreen(gameScreen);
    renderQuestion();
    window.setTimeout(() => yesButton.focus(), 250);
  }

  function moveNoButton() {
    const zoneRect = answerZone.getBoundingClientRect();
    const yesRect = yesButton.getBoundingClientRect();
    const maxX = Math.max(8, answerZone.clientWidth - noButton.offsetWidth - 8);
    const maxY = Math.max(8, answerZone.clientHeight - noButton.offsetHeight - 8);
    let x = 8;
    let y = 8;

    for (let attempt = 0; attempt < 20; attempt += 1) {
      x = Math.floor(Math.random() * maxX);
      y = Math.floor(Math.random() * maxY);
      const overlapsYes =
        x < yesRect.right - zoneRect.left + 18 &&
        x + noButton.offsetWidth > yesRect.left - zoneRect.left - 18 &&
        y < yesRect.bottom - zoneRect.top + 18 &&
        y + noButton.offsetHeight > yesRect.top - zoneRect.top - 18;
      if (!overlapsYes) break;
    }

    noButton.style.left = `${x}px`;
    noButton.style.top = `${y}px`;
  }

  function avoidNo(event) {
    event.preventDefault();
    noAttempts += 1;
    moveNoButton();
    answerMessage.textContent = noMessages[(noAttempts - 1) % noMessages.length];
    const growth = Math.min(1 + noAttempts * 0.045, 1.25);
    yesButton.style.setProperty("--yes-scale", String(growth));
  }

  function acceptYes() {
    yesButton.classList.add("is-celebrating");
    answerMessage.textContent = "I knew it! ♥";

    window.setTimeout(() => {
      if (currentQuestion < TOTAL_QUESTIONS - 1) {
        currentQuestion += 1;
        renderQuestion();
        questionText.animate(
          [
            { opacity: 0, transform: "translateY(10px)" },
            { opacity: 1, transform: "translateY(0)" }
          ],
          { duration: 350, easing: "ease-out" }
        );
      } else {
        showSurprise();
      }
    }, 420);
  }

  function createConfetti() {
    const container = document.querySelector("#confetti");
    const colors = ["#8f5bd7", "#d7b8ff", "#f7b7d2", "#fff0a6", "#ffffff"];
    container.replaceChildren();

    for (let index = 0; index < 60; index += 1) {
      const piece = document.createElement("i");
      piece.style.setProperty("--x", `${Math.random() * 100}vw`);
      piece.style.setProperty("--delay", `${Math.random() * 0.8}s`);
      piece.style.setProperty("--duration", `${2.4 + Math.random() * 2}s`);
      piece.style.setProperty("--rotation", `${Math.random() * 720 - 360}deg`);
      piece.style.background = colors[index % colors.length];
      container.appendChild(piece);
    }

    window.setTimeout(() => container.replaceChildren(), 5200);
  }

  function showSurprise() {
    showScreen(surpriseScreen);
    initializeCarousel();
    createConfetti();
    document.querySelector("#surprise-title").focus();
  }

  function initializeCarousel() {
    const carousel = document.querySelector("#photo-carousel");
    if (carousel.dataset.ready === "true") return;
    carousel.dataset.ready = "true";

    const track = document.querySelector("#carousel-track");
    const slides = [...document.querySelectorAll(".carousel__slide")];
    const dotsContainer = document.querySelector("#carousel-dots");
    const previousButton = document.querySelector("#previous-slide");
    const nextButton = document.querySelector("#next-slide");
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let currentSlide = 0;
    let autoplayId;
    let touchStartX = 0;

    function goToSlide(index) {
      currentSlide = (index + slides.length) % slides.length;
      track.style.transform = `translateX(-${currentSlide * 100}%)`;
      slides.forEach((slide, slideIndex) => {
        const active = slideIndex === currentSlide;
        slide.classList.toggle("is-current", active);
        slide.setAttribute("aria-hidden", String(!active));
      });
      [...dotsContainer.children].forEach((dot, dotIndex) => {
        const active = dotIndex === currentSlide;
        dot.classList.toggle("is-current", active);
        dot.setAttribute("aria-current", active ? "true" : "false");
      });
    }

    function stopAutoplay() {
      window.clearInterval(autoplayId);
    }

    function startAutoplay() {
      if (prefersReducedMotion) return;
      stopAutoplay();
      autoplayId = window.setInterval(() => goToSlide(currentSlide + 1), 5000);
    }

    slides.forEach((slide, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "carousel__dot";
      dot.setAttribute("aria-label", `Show photo ${index + 1}`);
      dot.addEventListener("click", () => {
        goToSlide(index);
        startAutoplay();
      });
      dotsContainer.appendChild(dot);
    });

    previousButton.addEventListener("click", () => {
      goToSlide(currentSlide - 1);
      startAutoplay();
    });
    nextButton.addEventListener("click", () => {
      goToSlide(currentSlide + 1);
      startAutoplay();
    });
    carousel.addEventListener("mouseenter", stopAutoplay);
    carousel.addEventListener("mouseleave", startAutoplay);
    carousel.addEventListener("focusin", stopAutoplay);
    carousel.addEventListener("focusout", startAutoplay);
    carousel.addEventListener("touchstart", (event) => {
      touchStartX = event.changedTouches[0].clientX;
      stopAutoplay();
    }, { passive: true });
    carousel.addEventListener("touchend", (event) => {
      const distance = event.changedTouches[0].clientX - touchStartX;
      if (Math.abs(distance) > 45) goToSlide(currentSlide + (distance < 0 ? 1 : -1));
      startAutoplay();
    }, { passive: true });

    goToSlide(0);
    startAutoplay();
  }

  startButton.addEventListener("click", startGame);
  yesButton.addEventListener("click", acceptYes);
  noButton.addEventListener("pointerdown", avoidNo);
  noButton.addEventListener("click", (event) => event.preventDefault());
  noButton.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") avoidNo(event);
  });
  window.addEventListener("resize", () => {
    if (!gameScreen.hidden) resetNoButton();
  });
})();
