import { storageService } from "./async-storage.service.js";
import { loadFromStorage, saveToStorage, makeId } from "./util.service.js";

export const placeService = {
  getPlaces,
  removePlace,
  addPlace,
  getPlaceById,
};

const STORAGE_KEY = "places";
const gDemoPlaces = [
  { name: "Eilat", lat: 29.557669, lng: 34.951923 },
  { name: "Tel Aviv", lat: 32.0853, lng: 34.781769 },
];

_createPlaces();

function getPlaces(delay) {
  return storageService.query(STORAGE_KEY, delay);
}
function removePlace(placeId) {
  return storageService.remove(STORAGE_KEY, placeId);
}

function addPlace(name, lat, lng, zoom) {
  return storageService.post(STORAGE_KEY, { name, lat, lng, zoom });
}

function getPlaceById(placeId) {
  return storageService.get(STORAGE_KEY, placeId);
}

function _createPlaces() {
  let places = loadFromStorage(STORAGE_KEY);
  if (places && places.length) return;

  places = gDemoPlaces.map((place) => _createPlace(place));
  saveToStorage(STORAGE_KEY, places);
}

function _createPlace(place, zoom = 8) {
  return { ...place, zoom, id: makeId() };
}
