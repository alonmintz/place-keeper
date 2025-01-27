import { loadFromStorage, saveToStorage, makeId } from "./util.service.js";

export const storageService = {
  query,
  get,
  post,
  put,
  remove,
};

function query(entityType, delay = 500) {
  var entities = loadFromStorage(entityType);
  return new Promise((resolve) => setTimeout(resolve, delay, entities));
}

function get(entityType, id) {
  return query(entityType).then((entities) => {
    const entity = entities.find((entity) => entity.id === id);
    if (!entity)
      throw new Error(
        `Get operation failed. cannot find ${entityType} with id: ${id}`
      );
    return entity;
  });
}

function post(entityType, entity) {
  entity = { ...entity, id: makeId() };
  return query(entityType).then((entities) => {
    entities.push(entity);
    saveToStorage(entityType, entities);
    return entity;
  });
}

function put(entityType, updatedEntity) {
  return query(entityType).then((entities) => {
    if (typeof entities === "object") {
      return _handleObjectResponse(entities, entityType, updatedEntity);
    }
    const idx = entities.findIndex((entity) => entity.id === updatedEntity.id);
    if (idx < 0)
      throw new Error(
        `Put operation failed. cannot find ${entityType} with id: ${updatedEntity.id}`
      );
    const entityToUpdate = { ...entities[idx], ...updatedEntity };
    entities.splice(idx, 1, entityToUpdate);
    saveToStorage(entityType, entityToUpdate);

    return entityToUpdate;
  });
}

function _handleObjectResponse(response, entityType, updatedEntity) {
  if (response.id !== updatedEntity.id) {
    throw new Error(
      `Put operation failed. cannot find ${entityType} with id: ${updatedEntity.id}`
    );
  }
  const entityToUpdate = { ...response, ...updatedEntity };
  saveToStorage(entityType, entityToUpdate);

  return entityToUpdate;
}

function remove(entityType, id) {
  return query(entityType, 0).then((entities) => {
    const idx = entities.findIndex((entity) => entity.id === id);
    if (idx < 0)
      throw new Error(
        `Remove operation failed. cannot find ${entityType} with id: ${updatedEntity.id}`
      );
    entities.splice(idx, 1);
    saveToStorage(entityType, entities);
  });
}
