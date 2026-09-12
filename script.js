const dialog = document.querySelector("#calendar");
const trigger = document.querySelector("#date-trigger");
const closeButton = document.querySelector("#calendar-close");
const doneButton = document.querySelector("#calendar-done");
const days = document.querySelector("#calendar-days");
const selection = document.querySelector("#calendar-selection");
const surprise = document.querySelector("#surprise");
const moodYes = document.querySelector("#mood-yes");
const moodNo = document.querySelector("#mood-no");
const moodMessage = document.querySelector("#mood-message");
const escapeOptions = document.querySelector("#escape-options");
const escapeCards = document.querySelectorAll(".escape-card");
const escapeSelection = document.querySelector("#escape-selection");
const subtopicPage = document.querySelector("#subtopic-page");
const subtopicChips = document.querySelector("#subtopic-chips");
const subtopicNote = document.querySelector("#subtopic-note");
const subtopicReaction = document.querySelector("#subtopic-reaction");
const staysPage = document.querySelector("#stays-page");
const verdictButton = document.querySelector("#verdict-button");
const fireworks = document.querySelector("#fireworks");
const birthdayCountdown = document.querySelector("#birthday-countdown");
const countdownBirthday = document.querySelector("#countdown-birthday");
const countdownDays = document.querySelector("#countdown-days");
const countdownHours = document.querySelector("#countdown-hours");
const countdownMinutes = document.querySelector("#countdown-minutes");
const countdownSeconds = document.querySelector("#countdown-seconds");
const birthdayMoment = new Date("2026-09-25T00:00:00+08:00").getTime();
let countdownTimerId = null;
let selectedCategory = "";
let selectedSubtopics = [];

const subtopicsByCategory = {
  romantic: ["Quiet & Secluded", "Private Pool", "Massage & Spa", "Beachfront Romance", "Somewhere New"],
  berserk: ["Shopping Spree", "Street Food Hunt", "Night Markets", "Café Hopping", "Somewhere New"],
  culture: ["Heritage Streets", "Local Food", "Slow Wandering", "Romantic Dinner", "Somewhere New"]
};

const departureDay = 24;
const birthdayDay = 25;
let returnDay = 28;

function renderCalendar() {
  days.replaceChildren();
  for (let blank = 0; blank < 2; blank += 1) days.append(document.createElement("span"));
  for (let day = 1; day <= 30; day += 1) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "calendar__day";
    button.textContent = day;
    button.setAttribute("role", "gridcell");
    button.setAttribute("aria-label", `${day} September 2026`);
    if (day < 27) button.disabled = true;
    if (day === departureDay) button.classList.add("calendar__day--start");
    if (day === birthdayDay) {
      button.classList.add("calendar__day--birthday");
      button.setAttribute("aria-label", "25 September 2026, Pouty’s birthday");
    }
    if (day > departureDay && day < returnDay) button.classList.add("calendar__day--range");
    if (day === returnDay) {
      button.classList.add("calendar__day--selected");
      button.setAttribute("aria-pressed", "true");
    }
    if (!button.disabled) button.addEventListener("click", () => selectReturn(day));
    days.append(button);
  }
}

function selectReturn(day) {
  if (day >= 29) {
    selection.textContent = "Oopsie Your Guy got no Leaves! 😔";
    selection.classList.add("calendar__selection--error");
    doneButton.disabled = true;
    return;
  }

  returnDay = day;
  selection.classList.remove("calendar__selection--error");
  doneButton.disabled = false;
  selection.textContent = `24–${day} September 2026 · ${day - departureDay} ${day - departureDay === 1 ? "Day" : "Days"}`;
  renderCalendar();
}

function openCalendar() {
  dialog.showModal();
  trigger.setAttribute("aria-expanded", "true");
}

function closeCalendar() {
  dialog.close();
  trigger.setAttribute("aria-expanded", "false");
  trigger.focus();
}

moodNo.addEventListener("click", () => {
  moodYes.classList.remove("mood-choice__button--selected");
  moodNo.classList.add("mood-choice__button--selected");
  moodMessage.hidden = false;
  moodMessage.classList.remove("mood-reaction--show");
  void moodMessage.offsetWidth;
  moodMessage.classList.add("mood-reaction--show");
});

moodYes.addEventListener("click", () => {
  moodNo.classList.remove("mood-choice__button--selected");
  moodYes.classList.add("mood-choice__button--selected");
  moodMessage.hidden = true;
  escapeOptions.hidden = false;
  requestAnimationFrame(() => escapeOptions.scrollIntoView({ behavior: "smooth", block: "start" }));
});

function showSubtopics(category) {
  selectedCategory = category;
  selectedSubtopics = [];
  subtopicChips.replaceChildren();
  subtopicsByCategory[category].forEach(label => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "subtopic-chip";
    chip.textContent = label;
    chip.addEventListener("click", () => {
      chip.classList.toggle("subtopic-chip--selected");
      selectedSubtopics = [...subtopicChips.querySelectorAll(".subtopic-chip--selected")].map(item => item.textContent);
      const categoryNotes = {
        romantic: "Just you, me, slow mornings and sunsets. Does that sound perfect? 🌅❤️",
        berserk: "Shopping, street food and your hand in mine — a perfect recipe, isn’t it? 🛍️🍜❤️",
        culture: "Let’s wander without a map, share every bite and collect some memories… 🧭🤎"
      };
      subtopicNote.textContent = selectedSubtopics.length
        ? `Selected: ${selectedSubtopics.join(" · ")}`
        : "Tap everything that sounds tempting.";
      subtopicReaction.textContent = selectedSubtopics.length ? categoryNotes[selectedCategory] : "";
    });
    subtopicChips.append(chip);
  });
  subtopicPage.className = `subtopic-page subtopic-page--${category}`;
  subtopicPage.hidden = false;
  subtopicNote.textContent = "Tap everything that sounds tempting.";
  subtopicReaction.textContent = "";
}

escapeCards.forEach(card => {
  card.addEventListener("click", () => {
    escapeCards.forEach(option => option.classList.remove("escape-card--selected"));
    card.classList.add("escape-card--selected");
    escapeSelection.textContent = card.dataset.response;
    showSubtopics(card.dataset.category);
    requestAnimationFrame(() => subtopicPage.scrollIntoView({ behavior: "smooth", block: "start" }));
  });
});

// Her room is settled, so the thumbnails are just for flicking through the photos.
document.querySelectorAll(".stay-thumb").forEach(thumb => {
  thumb.addEventListener("click", () => {
    const card = thumb.closest(".stay-card");
    card.querySelectorAll(".stay-thumb").forEach(other => other.classList.remove("is-active"));
    thumb.classList.add("is-active");
    card.querySelector(".stay-card__main").src = thumb.dataset.src;
  });
});

verdictButton.addEventListener("click", () => {
  staysPage.scrollIntoView({ behavior: "smooth", block: "start" });
});

function updateBirthdayCountdown() {
  const remaining = birthdayMoment - Date.now();
  if (remaining <= 0) {
    birthdayCountdown.hidden = true;
    countdownBirthday.hidden = false;
    if (countdownTimerId) clearInterval(countdownTimerId);
    countdownTimerId = null;
    return;
  }

  const totalSeconds = Math.floor(remaining / 1000);
  const daysLeft = Math.floor(totalSeconds / 86400);
  const hoursLeft = Math.floor((totalSeconds % 86400) / 3600);
  const minutesLeft = Math.floor((totalSeconds % 3600) / 60);
  const secondsLeft = totalSeconds % 60;
  countdownDays.textContent = String(daysLeft).padStart(2, "0");
  countdownHours.textContent = String(hoursLeft).padStart(2, "0");
  countdownMinutes.textContent = String(minutesLeft).padStart(2, "0");
  countdownSeconds.textContent = String(secondsLeft).padStart(2, "0");
}

function startBirthdayCountdown() {
  if (countdownTimerId) clearInterval(countdownTimerId);
  birthdayCountdown.hidden = false;
  countdownBirthday.hidden = true;
  updateBirthdayCountdown();
  countdownTimerId = setInterval(updateBirthdayCountdown, 1000);
}

function launchFireworks() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  fireworks.replaceChildren();
  const colors = ["#dabd88", "#f9edda", "#e7a1a0", "#f2a85e"];
  for (let index = 0; index < 56; index += 1) {
    const spark = document.createElement("i");
    spark.className = "firework";
    spark.style.setProperty("--angle", `${(360 / 56) * index}deg`);
    spark.style.setProperty("--distance", `${85 + Math.random() * 145}px`);
    spark.style.setProperty("--delay", `${Math.random() * .32}s`);
    spark.style.setProperty("--spark", colors[index % colors.length]);
    fireworks.append(spark);
  }
}

trigger.addEventListener("click", openCalendar);
closeButton.addEventListener("click", closeCalendar);
doneButton.addEventListener("click", () => {
  closeCalendar();
  surprise.hidden = false;
  requestAnimationFrame(() => surprise.scrollIntoView({ behavior: "smooth", block: "start" }));
});
dialog.addEventListener("click", event => {
  if (event.target === dialog) closeCalendar();
});
dialog.addEventListener("close", () => {
  trigger.setAttribute("aria-expanded", "false");
});

renderCalendar();

// Everything is settled now: Pouty picked the dates, the mood and the
// preferences on 27 Aug, and the room on 3 Sep. Replay all of it as
// already-chosen so the earlier pages read as finished if she scrolls
// back, and open on the summary. Nothing here submits anything — her
// response is already recorded, and posting again would duplicate it.
const POUTYS_PICKS = {
  returnDay: 28,
  category: "berserk",
  subtopics: ["Shopping Spree", "Street Food Hunt", "Night Markets", "Café Hopping"]
};

function replayPoutysPicks() {
  selectReturn(POUTYS_PICKS.returnDay);

  surprise.hidden = false;
  moodYes.classList.add("mood-choice__button--selected");
  moodMessage.hidden = true;

  escapeOptions.hidden = false;
  const chosenCard = document.querySelector(`.escape-card[data-category="${POUTYS_PICKS.category}"]`);
  showSubtopics(POUTYS_PICKS.category);
  if (chosenCard) {
    chosenCard.classList.add("escape-card--selected");
    escapeSelection.textContent = chosenCard.dataset.response;
  }

  subtopicChips.querySelectorAll(".subtopic-chip").forEach(chip => {
    if (POUTYS_PICKS.subtopics.includes(chip.textContent)) chip.classList.add("subtopic-chip--selected");
  });
  selectedSubtopics = [...subtopicChips.querySelectorAll(".subtopic-chip--selected")].map(chip => chip.textContent);
  subtopicNote.textContent = `Selected: ${selectedSubtopics.join(" · ")}`;
  subtopicReaction.textContent = "Shopping, street food and your hand in mine — a perfect recipe, isn’t it? 🛍️🍜❤️";
}

replayPoutysPicks();
startBirthdayCountdown();

// Open straight on the summary, without animating through everything above.
// Stop the browser restoring a previous scroll position, or a reload lands
// wherever she happened to be rather than on the summary.
if ("scrollRestoration" in history) history.scrollRestoration = "manual";

function openOnSummary() {
  // Kept free of requestAnimationFrame on purpose: rAF does not fire while a
  // tab is in the background, so opening the link in a background tab would
  // leave the page unscrolled and the sparks missing until she switched to it.
  const previous = document.documentElement.style.scrollBehavior;
  document.documentElement.style.scrollBehavior = "auto";
  staysPage.scrollIntoView({ block: "start" });
  document.documentElement.style.scrollBehavior = previous;
  launchFireworks();
}

// A cached reload can fire "load" before this file runs, and a listener added
// afterwards would never be called — so check the state before waiting on it.
if (document.readyState === "complete") openOnSummary();
else window.addEventListener("load", openOnSummary, { once: true });
