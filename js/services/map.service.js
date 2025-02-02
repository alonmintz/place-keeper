import { Loader } from "https://cdn.skypack.dev/@googlemaps/js-api-loader";
import { placeService } from "./place.service.js";

export const mapService = {
  initMap,
  panToPlace,
  setMapCenter,
  renderMarkers,
};

const API_KEY = "AIzaSyAxBNtqQMyvMLsKFmd93i6y9Q0KcE4lTTM";

let gMap;
let gMarkers;

const loader = new Loader({
  apiKey: API_KEY,
  version: "weekly",
});

const { Map } = await loader.importLibrary("maps");
const { AdvancedMarkerElement } = await loader.importLibrary("marker");

async function initMap(renderPlacesCB) {
  const places = await placeService.getPlaces();

  gMarkers = [];

  places.forEach((place) => {
    const position = { lat: place.lat, lng: place.lng };
    if (!gMap) {
      gMap = new Map(document.querySelector(".map"), {
        zoom: place.zoom,
        center: position,
        mapId: "DEMO_MAP_ID",
      });
    }
    const marker = new AdvancedMarkerElement({
      map: gMap,
      position: position,
      title: place.name,
    });
    gMarkers.push(marker);
  });

  gMap.addListener("click", async (ev) => {
    const name = prompt("Place name?", "Place 1");
    const lat = ev.latLng.lat();
    const lng = ev.latLng.lng();
    if (name) {
      await placeService.addPlace(name, lat, lng, gMap.getZoom());
      await renderPlacesCB();
      await renderMarkers();
    }
  });
}

async function panToPlace(placeId) {
  const place = await placeService.getPlaceById(placeId);
  gMap.setCenter({ lat: place.lat, lng: place.lng });
  gMap.setZoom(place.zoom);
}

function setMapCenter(lat, lng) {
  gMap.setCenter({ lat, lng });
}

async function renderMarkers() {
  const places = await placeService.getPlaces();
  gMarkers.forEach((marker) => marker.setMap(null));
  gMarkers = places.map((place) => {
    const position = { lat: place.lat, lng: place.lng };
    return new AdvancedMarkerElement({
      map: gMap,
      position: position,
      title: place.name,
    });
  });
}
