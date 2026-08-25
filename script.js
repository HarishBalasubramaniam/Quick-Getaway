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
const hero = document.querySelector(".hero");
const verdictButton = document.querySelector("#verdict-button");
const verdictDialog = document.querySelector("#verdict-dialog");
const verdictClose = document.querySelector("#verdict-close");
const fireworks = document.querySelector("#fireworks");
let selectedCategory = "";
let selectedSubtopics = [];

const subtopicsByCategory = {
  romantic: ["Quiet & Secluded", "Private Pool", "Massage & Spa", "Beachfront Romance", "Somewhere New"],
  berserk: ["Shopping Spree", "Street Food Hunt", "Night Markets", "Café Hopping", "Somewhere New"],
  culture: ["Heritage Streets", "Local Food", "Slow Wandering", "Romantic Dinner", "Somewhere New"]
};

const departureDay = 24;
const birthdayDay = 25;
let returnDay = 27;

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
  verdictButton.disabled = true;
  subtopicChips.replaceChildren();
  subtopicsByCategory[category].forEach(label => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "subtopic-chip";
    chip.textContent = label;
    chip.addEventListener("click", () => {
      chip.classList.toggle("subtopic-chip--selected");
      selectedSubtopics = [...subtopicChips.querySelectorAll(".subtopic-chip--selected")].map(item => item.textContent);
      verdictButton.disabled = selectedSubtopics.length === 0;
      const categoryNotes = {
        romantic: "That sounds like us—slow mornings, soft sunsets and nowhere else we need to be. 🌅❤️",
        berserk: "Let’s chase flavours, fill the bags and make a little beautiful chaos together. 🛍️🍜",
        culture: "Let’s wander without a map, share every bite and collect stories that belong only to us. 🏮❤️"
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
  requestAnimationFrame(() => subtopicPage.scrollIntoView({ behavior: "smooth", block: "start" }));
}

escapeCards.forEach(card => {
  card.addEventListener("click", () => {
    escapeCards.forEach(option => option.classList.remove("escape-card--selected"));
    card.classList.add("escape-card--selected");
    escapeSelection.textContent = card.dataset.response;
    showSubtopics(card.dataset.category);
  });
});

const destinationProfiles = {
  "Koh Samui": { romantic:5, berserk:1, culture:1, "Quiet & Secluded":3, "Private Pool":3, "Massage & Spa":3, "Beachfront Romance":3, "Somewhere New":2 },
  "Bali / Ubud": { romantic:5, berserk:2, culture:4, "Quiet & Secluded":3, "Private Pool":3, "Massage & Spa":3, "Heritage Streets":2, "Local Food":2, "Slow Wandering":3, "Somewhere New":2 },
  "Phuket": { romantic:4, berserk:3, culture:1, "Private Pool":3, "Beachfront Romance":3, "Shopping Spree":2, "Night Markets":2 },
  "Bangkok": { romantic:1, berserk:5, culture:4, "Shopping Spree":3, "Street Food Hunt":3, "Night Markets":3, "Café Hopping":2, "Heritage Streets":2, "Local Food":3 },
  "Kuala Lumpur": { romantic:1, berserk:5, culture:3, "Shopping Spree":3, "Street Food Hunt":2, "Café Hopping":3, "Local Food":3 },
  "Ho Chi Minh City": { romantic:1, berserk:4, culture:5, "Shopping Spree":2, "Street Food Hunt":3, "Café Hopping":3, "Heritage Streets":3, "Local Food":3, "Somewhere New":2 },
  "Penang": { romantic:2, berserk:3, culture:5, "Street Food Hunt":3, "Heritage Streets":3, "Local Food":3, "Slow Wandering":2, "Somewhere New":2 },
  "Da Nang / Hoi An": { romantic:4, berserk:1, culture:5, "Beachfront Romance":3, "Heritage Streets":3, "Local Food":2, "Slow Wandering":3, "Romantic Dinner":2, "Somewhere New":3 },
  "Langkawi": { romantic:5, berserk:1, culture:1, "Quiet & Secluded":3, "Private Pool":2, "Massage & Spa":2, "Beachfront Romance":3, "Somewhere New":2 }
};

function calculateMatches() {
  return Object.entries(destinationProfiles)
    .map(([name, profile]) => ({
      name,
      score: (profile[selectedCategory] || 0) * 3 + selectedSubtopics.reduce((total, topic) => total + (profile[topic] || 0), 0)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map(item => item.name);
}

const googleFormConfig = {
  action: "",
  categoryEntry: "",
  subtopicsEntry: "",
  matchesEntry: ""
};

function submitGoogleForm(result) {
  if (!googleFormConfig.action) return false;
  const payload = new FormData();
  payload.append(googleFormConfig.categoryEntry, result.category);
  payload.append(googleFormConfig.subtopicsEntry, result.subtopics.join(", "));
  payload.append(googleFormConfig.matchesEntry, result.matches.join(" + "));
  fetch(googleFormConfig.action, { method:"POST", mode:"no-cors", body:payload });
  return true;
}

function launchFireworks() {
  fireworks.replaceChildren();
  const colors = ["#dabd88", "#f9edda", "#e7a1a0", "#f2a85e"];
  for (let index = 0; index < 28; index += 1) {
    const spark = document.createElement("i");
    spark.className = "firework";
    spark.style.setProperty("--angle", `${(360 / 28) * index}deg`);
    spark.style.setProperty("--distance", `${70 + Math.random() * 115}px`);
    spark.style.setProperty("--delay", `${Math.random() * .22}s`);
    spark.style.setProperty("--spark", colors[index % colors.length]);
    fireworks.append(spark);
  }
}

verdictButton.addEventListener("click", () => {
  const matches = calculateMatches();
  const result = { category:selectedCategory, subtopics:selectedSubtopics, matches };
  localStorage.setItem("poutyVerdict", JSON.stringify(result));
  submitGoogleForm(result);
  launchFireworks();
  verdictDialog.showModal();
});

verdictClose.addEventListener("click", () => {
  verdictDialog.close();
  selectedCategory = "";
  selectedSubtopics = [];
  verdictButton.disabled = true;
  subtopicChips.replaceChildren();
  subtopicNote.textContent = "Tap everything that sounds tempting.";
  subtopicReaction.textContent = "";
  escapeCards.forEach(card => card.classList.remove("escape-card--selected"));
  moodYes.classList.remove("mood-choice__button--selected");
  moodNo.classList.remove("mood-choice__button--selected");
  moodMessage.hidden = true;
  surprise.hidden = true;
  escapeOptions.hidden = true;
  subtopicPage.hidden = true;
  requestAnimationFrame(() => hero.scrollIntoView({ behavior: "smooth", block: "start" }));
});

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
dialog.addEventListener("close", () => trigger.setAttribute("aria-expanded", "false"));
renderCalendar();

