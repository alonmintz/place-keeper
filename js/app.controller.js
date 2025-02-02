import { mapService } from "./services/map.service.js";
import { placeService } from "./services/place.service.js";
import { userService } from "./services/user.service.js";

window.app = {
  onInit,
  onRemovePlace,
  onPanToPlace,
  onUserLocation,
  onShowSection,
  onShowPreferences,
  onSubmitPreferences,
  onCancel,
  renderAgeDisplay,
};

var gUser;

async function onInit() {
  try {
    await initUser();
    renderPreferences();
  } catch (err) {
    alert("error: ", err);
  }

  document.querySelector(".map-container").style.display = "none";

  try {
    await mapService.initMap(renderPlaces);
  } catch (err) {
    alert("error: ", err);
  }

  try {
    await renderPlaces();
  } catch (err) {
    alert("error: ", err);
  }
}

async function initUser() {
  try {
    gUser = await userService.getUser();
  } catch (err) {
    alert("error: ", err);
  }
}
function renderPreferences() {
  document.body.style.backgroundColor = gUser.bgColor;
  document.body.style.color = gUser.txtColor;

  document.getElementById("email-input").value = gUser.email || "";
  document.getElementById("age-input").value = gUser.age;
  renderAgeDisplay(gUser.age);
  document.getElementById("date-input").value = gUser.birthDate;
  document.getElementById("time-input").value = gUser.birthTime;
  document.querySelector(".bg-color-input").value = gUser.bgColor;
  document.querySelector(".txt-color-input").value = gUser.txtColor;
}

async function renderPlaces() {
  try {
    const places = await placeService.getPlaces();
    const strHTML = places.map(
      (place) => `
      <li>
          <span>${place.name}</span>
          <button onclick="app.onRemovePlace('${place.id}')">❌</button><button onclick="app.onPanToPlace('${place.id}')">🚶</button>
      </li>
      `
    );

    const elPlaceList = document.querySelector(".place-list");
    elPlaceList.innerHTML = strHTML.join("");
  } catch (err) {
    alert("error: ", err);
  }
}

async function onRemovePlace(placeId) {
  try {
    await placeService.removePlace(placeId);
    await renderPlaces();
    await mapService.renderMarkers();
  } catch (err) {
    alert("error: ", err);
  }
}

async function onPanToPlace(placeId) {
  mapService.panToPlace(placeId);
}

async function onUserLocation() {
  const geolocation = navigator.geolocation;
  if (geolocation) {
    geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        mapService.setMapCenter(lat, lng);
      },
      () => console.error("Unable to retrieve your location.")
    );
  } else {
    console.error("Geolocation is not supported by this browser.");
  }
}

function onShowSection(sectionClass) {
  document.querySelectorAll("main > section").forEach((section) => {
    section.style.display = "none";
  });
  document.querySelector(sectionClass).style.display =
    sectionClass === ".map-container" ? "grid" : "block";
}

function onShowPreferences() {
  document.querySelector(".user-pref-modal").showModal();
}

async function onSubmitPreferences() {
  const email = document.getElementById("email-input").value;
  const age = document.getElementById("age-input").value;
  const birthDate = document.getElementById("date-input").value;
  const birthTime = document.getElementById("time-input").value;
  const bgColor = document.querySelector(".bg-color-input").value;
  const txtColor = document.querySelector(".txt-color-input").value;

  const userToUpdate = {
    ...gUser,
    email,
    age,
    birthDate,
    birthTime,
    bgColor,
    txtColor,
  };

  try {
    const updatedUser = await userService.updateUser(userToUpdate);
    gUser = updatedUser;
    renderPreferences();
  } catch (err) {
    alert("error: ", err);
  }
}

function onCancel() {
  renderPreferences();
  document.querySelector(".user-pref-modal").close();
}

function renderAgeDisplay(value) {
  document.querySelector(".age-display").textContent = value;
}
