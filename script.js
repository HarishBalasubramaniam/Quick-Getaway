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
    if (day < departureDay || day === departureDay) button.disabled = true;
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
  if (day > 29) {
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

escapeCards.forEach(card => {
  card.addEventListener("click", () => {
    escapeCards.forEach(option => option.classList.remove("escape-card--selected"));
    card.classList.add("escape-card--selected");
    escapeSelection.textContent = `${card.dataset.mood} — that sounds very Pouty. ✨`;
  });
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

