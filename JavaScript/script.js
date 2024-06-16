"use strict";

const form = document.getElementById("form");
const activityList = document.querySelector(".activities");
const inputActivity = document.querySelector(".form-input-activity");
const inputName = document.querySelector(".form-input-name");
const inputType = document.querySelector(".form-input-type");
const inputDuration = document.querySelector(".form-input-duration");
const inputCost = document.querySelector(".form-input-cost");

class App {
  #map;
  #mapEvent;
  #activities = [];

  constructor() {
    this._getPosition();

    inputActivity.addEventListener(
      "change",
      this._toggleActivityType.bind(this)
    );

    form.addEventListener("submit", this._newActivity.bind(this));

    activityList.addEventListener("click", this._moveToPopup.bind(this));
  }

  _getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert("Please allow us to get your current position.");
        }
      );
    }
  }

  _loadMap(position) {
    const { latitude, longitude } = position.coords;
    const coords = [latitude, longitude];

    this.#map = L.map("map").setView(coords, 13);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    // the function below is used to pop the form up after clicking on the map
    // we are using the on method provided by leaflet
    this.#map.on("click", this._showForm.bind(this));
  }

  _showForm(event) {
    this.#mapEvent = event;
    form.classList.remove("hidden");
    inputName.focus();
  }

  _hideForm() {
    inputName.value = inputType.value = inputDuration.value = "";

    form.style.display = "none";
    form.classList.add("hidden");
    setTimeout(() => (form.style.display = "grid"), 1000);
  }

  _toggleActivityType() {
    inputCost.closest(".form-row").classList.toggle("form-row-hidden");
    inputDuration.closest(".form-row").classList.toggle("form-row-hidden");
  }

  // the function below is for submitting the activity form
  _newActivity(event) {
    event.preventDefault();

    // helper function
    const inputValid = (...inputs) => inputs.every((input) => input !== "");

    const activity = inputActivity.value;

    const name = inputName.value;
    // const activity = inputActivity.value;
    const type = inputType.value;
    const { lat, lng } = this.#mapEvent.latlng;
    let newInputActivity;

    // for type === food
    if (activity === "food") {
      const cost = inputCost.value;

      if (!inputValid(name, type, cost)) {
        return alert(`Please check the input details.`);
      }

      newInputActivity = new Food([lat, lng], name, type, cost);
    }

    // for type === fun
    if (activity === "fun") {
      const duration = inputDuration.value;

      if (!inputValid(name, type, duration)) {
        return alert(`Please check the input details`);
      }

      newInputActivity = new Fun([lat, lng], name, type, duration);
    }

    // add new object to activities array
    this.#activities.push(newInputActivity);

    L.marker([lat, lng])
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${activity}-popup`,
        })
      )
      .setPopupContent(`${newInputActivity.description}`)
      .openPopup();

    let htmlText = `
      <li class="activity activity-${activity}" data-id=${newInputActivity.id}>
        <h2 class="activity-title">${newInputActivity.name[0].toUpperCase()}${newInputActivity.name.slice(
      1
    )}</h2>

        <div class="activity-details">
          <span class="activity-type">${
            activity === "food" ? "Food" : "Fun"
          }:</span>
          <span class="activity-value">${newInputActivity.type[0].toUpperCase()}${newInputActivity.type.slice(
      1
    )}</span>
        </div> `;

    if (activity === "food") {
      htmlText += `
          <div class="activity-details">
            <span class="activity-value">${newInputActivity.cost}</span>
          </div>
        </li>
        `;
    }

    if (activity === "fun") {
      htmlText += `
        <div class="activity-details">
          <span class="activity-icon">🕰️</span>
          <span class="activity-value">${newInputActivity.duration}</span>
          <span class="activity-unit">min</span>
        </div>
      </li>
      `;
    }

    form.insertAdjacentHTML("afterend", htmlText);

    this._hideForm();
  }

  _moveToPopup(event) {
    const activityEl = event.target.closest(".activity");

    if (!activityEl) return;

    const activity = this.#activities.find(
      (addedActivity) => addedActivity.id === activityEl.dataset.id
    );

    this.#map.setView(activity.coords, 13);
  }
}

const app = new App();
