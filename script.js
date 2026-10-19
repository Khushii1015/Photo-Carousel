/* =========================================================
   The Power of Sequencing
   Three images, two orders, two stories.
   ========================================================= */


/* ---------- 1. DATA ----------
   The three images. Each one appears in BOTH sequences —
   only the order (and the caption) changes. */
const images = {
  embrace: {
    src: "images/embrace.svg",
    alt: "Two people hugging in an open doorway at night"
  },
  suitcase: {
    src: "images/suitcase.svg",
    alt: "A packed suitcase standing next to the front door"
  },
  window: {
    src: "images/window.svg",
    alt: "A person sitting alone at a rainy window holding a mug"
  }
};

/* The two sequences. Same images, reversed order, new meaning. */
const sequences = {
  goodbye: {
    title: "The Goodbye",
    steps: [
      {
        image: "embrace",
        caption: "One last hug at the door. Neither of them wants to be the first to let go."
      },
      {
        image: "suitcase",
        caption: "The suitcase is packed and waiting. Outside, the taxi’s engine is already running."
      },
      {
        image: "window",
        caption: "The rain starts after the car pulls away. The house has never felt this quiet."
      }
    ]
  },

  homecoming: {
    title: "The Homecoming",
    steps: [
      {
        image: "window",
        caption: "Another evening at the window, counting down the days until they come back."
      },
      {
        image: "suitcase",
        caption: "A suitcase in the hallway. The door clicks shut behind it. They’re home."
      },
      {
        image: "embrace",
        caption: "The hug they’ve been waiting months for. This time, nobody has to let go."
      }
    ]
  }
};

const actLabels = ["Beginning", "Middle", "End"];


/* ---------- 2. STATE (variables that change as the user interacts) ---------- */
let currentSequence = "goodbye";   // which story is showing
let currentStep = 0;               // 0 = beginning, 1 = middle, 2 = end
let autoplayTimer = null;          // holds the setInterval id while playing

const FADE_TIME = 300;             // ms — matches the CSS transition
const AUTOPLAY_DELAY = 3500;       // ms between frames when playing


/* ---------- 3. DOM REFERENCES ---------- */
const stageImage    = document.getElementById("stage-image");
const actBadge      = document.getElementById("act-badge");
const stepCount     = document.getElementById("step-count");
const sequenceTitle = document.getElementById("sequence-title");
const caption       = document.getElementById("caption");
const prevBtn       = document.getElementById("prev-btn");
const nextBtn       = document.getElementById("next-btn");
const playBtn       = document.getElementById("play-btn");
const filmstrip     = document.getElementById("filmstrip");
const versionBtns   = document.querySelectorAll(".version-btn");


/* ---------- 4. FUNCTIONS ---------- */

/* Shows one step of the current sequence: swaps the image,
   caption, labels and button states. */
function showStep(index) {
  currentStep = index;

  const sequence = sequences[currentSequence];
  const step = sequence.steps[currentStep];
  const img = images[step.image];

  // Fade out, swap the content, then fade back in
  stageImage.classList.add("is-fading");
  caption.classList.add("is-fading");

  setTimeout(function () {
    stageImage.src = img.src;
    stageImage.alt = img.alt;
    caption.textContent = step.caption;

    stageImage.classList.remove("is-fading");
    caption.classList.remove("is-fading");
  }, FADE_TIME);

  // These update right away
  actBadge.textContent = actLabels[currentStep];
  stepCount.textContent = (currentStep + 1) + " of " + sequence.steps.length;
  sequenceTitle.textContent = sequence.title;

  updateButtons();
  highlightThumb();
}

/* Moves forward one step. At the end, it loops back to the start. */
function nextStep() {
  const lastStep = sequences[currentSequence].steps.length - 1;

  if (currentStep < lastStep) {
    showStep(currentStep + 1);
  } else {
    showStep(0);
  }
}

/* Moves back one step (if not already at the beginning). */
function prevStep() {
  if (currentStep > 0) {
    showStep(currentStep - 1);
  }
}

/* Switches to the other sequence and starts it from the beginning. */
function switchSequence(name) {
  if (name === currentSequence) return;

  currentSequence = name;

  // Change the colour theme by swapping the class on <body>
  document.body.className = "theme-" + name;

  // Update which toggle button looks pressed
  versionBtns.forEach(function (btn) {
    const isActive = btn.dataset.sequence === name;
    btn.setAttribute("aria-pressed", isActive);
  });

  stopAutoplay();
  buildFilmstrip();
  showStep(0);
}

/* Rebuilds the filmstrip so the thumbnails appear in the
   current sequence's order (creates new DOM elements each time). */
function buildFilmstrip() {
  filmstrip.innerHTML = "";

  sequences[currentSequence].steps.forEach(function (step, i) {
    const item = document.createElement("li");
    item.className = "thumb";
    item.style.animationDelay = (i * 120) + "ms";

    const thumbImg = document.createElement("img");
    thumbImg.src = images[step.image].src;
    thumbImg.alt = images[step.image].alt;

    const label = document.createElement("span");
    label.className = "thumb-label";
    label.textContent = (i + 1) + ". " + actLabels[i];

    item.appendChild(thumbImg);
    item.appendChild(label);

    // Clicking a thumbnail jumps straight to that step
    item.addEventListener("click", function () {
      stopAutoplay();
      showStep(i);
    });

    filmstrip.appendChild(item);
  });
}

/* Marks the thumbnail that matches the current step. */
function highlightThumb() {
  const thumbs = filmstrip.querySelectorAll(".thumb");

  thumbs.forEach(function (thumb, i) {
    thumb.classList.toggle("is-active", i === currentStep);
  });
}

/* Disables "Back" at the beginning and changes "Next" to
   "Start over" at the end. */
function updateButtons() {
  const lastStep = sequences[currentSequence].steps.length - 1;

  prevBtn.disabled = currentStep === 0;
  nextBtn.textContent = currentStep === lastStep ? "↺ Start over" : "Next →";
}

/* Plays the sequence automatically, one frame at a time. */
function startAutoplay() {
  playBtn.textContent = "❚❚ Pause";
  showStep(0);

  autoplayTimer = setInterval(function () {
    const lastStep = sequences[currentSequence].steps.length - 1;

    if (currentStep < lastStep) {
      showStep(currentStep + 1);
    } else {
      stopAutoplay();   // stop once the story reaches its end
    }
  }, AUTOPLAY_DELAY);
}

function stopAutoplay() {
  clearInterval(autoplayTimer);
  autoplayTimer = null;
  playBtn.textContent = "▶ Play";
}

function toggleAutoplay() {
  if (autoplayTimer) {
    stopAutoplay();
  } else {
    startAutoplay();
  }
}


/* ---------- 5. EVENT LISTENERS ---------- */

// Version A / B buttons
versionBtns.forEach(function (btn) {
  btn.addEventListener("click", function () {
    switchSequence(btn.dataset.sequence);
  });
});

// Back / Next / Play buttons
nextBtn.addEventListener("click", function () {
  stopAutoplay();
  nextStep();
});

prevBtn.addEventListener("click", function () {
  stopAutoplay();
  prevStep();
});

playBtn.addEventListener("click", toggleAutoplay);

// Clicking the main image advances the story
stageImage.addEventListener("click", function () {
  stopAutoplay();
  nextStep();
});

// Arrow keys move through the story
document.addEventListener("keydown", function (event) {
  if (event.key === "ArrowRight") {
    stopAutoplay();
    nextStep();
  } else if (event.key === "ArrowLeft") {
    stopAutoplay();
    prevStep();
  }
});


/* ---------- 6. START ---------- */
buildFilmstrip();
showStep(0);
