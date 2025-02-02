import { storageService } from "./async-storage.service.js";
import { loadFromStorage, saveToStorage, makeId } from "./util.service.js";

export const userService = {
  getUser,
  updateUser,
};

const STORAGE_KEY = "user";
const defaultUser = {
  email: "",
  txtColor: "#000000",
  bgColor: "#DAA520",
  age: "18",
  birthDate: "",
  birthTime: "",
};

_createUser();

function getUser() {
  return storageService.query(STORAGE_KEY, 0);
}

function updateUser(updatedUser) {
  return storageService.put(STORAGE_KEY, updatedUser);
}

function _createUser() {
  let user = loadFromStorage(STORAGE_KEY);
  if (user && user.length !== 0) return;
  user = { ...defaultUser, id: makeId() };
  saveToStorage(STORAGE_KEY, user);
}
