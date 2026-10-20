const images = { // The three photos, used in both stories
  selfie: { src: "images/selfie.jpg", alt: "My friend and me taking a selfie together" },
  arcade: { src: "images/arcade.jpg", alt: "My friend and me playing arcade games" },
  hug: { src: "images/hug.jpg", alt: "My friend and me hugging" }
};

const sequences = { // The two stories: same photos, different order
  reunion: {
    title: "The Reunion",
    steps: [
      { image: "selfie", caption: "After way too long apart, we were finally together again. First order of business: a selfie." },
      { image: "arcade", caption: "We spent the afternoon at the arcade, trash-talking and competing like no time had passed." },
      { image: "hug", caption: "One last hug before we went our separate ways. Let’s not wait so long next time." }
    ]
  },
  strangers: {
    title: "Strangers to Friends",
    steps: [
      { image: "arcade", caption: "Two strangers at side-by-side machines, both chasing the same high score. Neither of us would back down." },
      { image: "hug", caption: "Somewhere around round ten, the rivalry turned into laughing. We called it a tie and hugged it out." },
      { image: "selfie", caption: "Our very first photo together. The day a rival became a friend." }
    ]
  }
};

const actLabels = ["Beginning", "Middle", "End"];
const lastStep = 2; // Index of the end step

let currentSequence = "reunion"; // Which story is showing
let currentStep = 0; // 0 = beginning, 1 = middle, 2 = end

const stageImage = document.getElementById("stage-image");
const actBadge = document.getElementById("act-badge");
const sequenceTitle = document.getElementById("sequence-title");
const caption = document.getElementById("caption");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const filmstrip = document.getElementById("filmstrip");
const versionBtns = document.querySelectorAll(".version-btn");

function showStep(index) { // Shows the photo, caption and label for one step of the current story
  currentStep = index;
  const step = sequences[currentSequence].steps[currentStep];

  stageImage.src = images[step.image].src;
  stageImage.alt = images[step.image].alt;
  caption.textContent = step.caption;
  actBadge.textContent = actLabels[currentStep];
  sequenceTitle.textContent = sequences[currentSequence].title;

  prevBtn.disabled = currentStep === 0;
  nextBtn.textContent = currentStep === lastStep ? "Start over" : "Next";

  highlightThumb();
}

function nextStep() { // Moves forward one step, or back to the beginning after the end
  if (currentStep < lastStep) {
    showStep(currentStep + 1);
  } else {
    showStep(0);
  }
}

function prevStep() { // Moves back one step unless already at the beginning
  if (currentStep > 0) {
    showStep(currentStep - 1);
  }
}

function switchSequence(name) { // Switches to the chosen story and starts it from the beginning
  currentSequence = name;
  document.body.className = "theme-" + name;

  versionBtns.forEach(function (btn) {
    btn.classList.toggle("active", btn.dataset.sequence === name);
  });

  buildFilmstrip();
  showStep(0);
}

function buildFilmstrip() { // Creates the row of thumbnails in the current story's order
  filmstrip.innerHTML = "";

  sequences[currentSequence].steps.forEach(function (step, i) {
    const item = document.createElement("li");
    item.className = "thumb";

    const thumbImg = document.createElement("img");
    thumbImg.src = images[step.image].src;
    thumbImg.alt = images[step.image].alt;

    const label = document.createElement("p");
    label.textContent = (i + 1) + ". " + actLabels[i];

    item.appendChild(thumbImg);
    item.appendChild(label);

    item.addEventListener("click", function () { // Jumps to this step when its thumbnail is clicked
      showStep(i);
    });

    filmstrip.appendChild(item);
  });
}

function highlightThumb() { // Highlights the thumbnail that matches the current step
  filmstrip.querySelectorAll(".thumb").forEach(function (thumb, i) {
    thumb.classList.toggle("active", i === currentStep);
  });
}

versionBtns.forEach(function (btn) {
  btn.addEventListener("click", function () { // Switches stories when an A or B button is clicked
    switchSequence(btn.dataset.sequence);
  });
});

nextBtn.addEventListener("click", nextStep);
prevBtn.addEventListener("click", prevStep);
stageImage.addEventListener("click", nextStep);

buildFilmstrip();
showStep(0);
