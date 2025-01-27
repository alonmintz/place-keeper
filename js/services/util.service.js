export function loadFromStorage(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

export function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function makeId(length = 6) {
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var id = "";

  for (var i = 0; i < length; i++) {
    id += possible.charAt(getRandomInt(0, possible.length));
  }
  return id;
}

export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

export function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}
