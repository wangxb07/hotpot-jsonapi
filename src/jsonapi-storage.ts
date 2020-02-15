import {ResourceIdentity, Resource} from "./resource-document";
import JsonapiResource from "./jsonapi-resource";
import JsonapiManager from "./jsonapi-manager";

export interface JsonapiStorageInterface {
  find(identity: ResourceIdentity): JsonapiResource;
  insert(identity: ResourceIdentity): boolean;
}

export default class JsonapiStorage implements JsonapiStorageInterface {
  private readonly _manager: JsonapiManager;
  private _data: Map<string, Resource>;

  constructor(manager: JsonapiManager) {
    this._manager = manager;
    this._data = new Map();
  }

  find(identity: ResourceIdentity): JsonapiResource | null {
    const key = this._hash(identity);
    if (this._data.has(key)) {
      const d = this._data.get(key);
      return new JsonapiResource(d, this._manager);
    }
    return null;
  }

  insert(resource: Resource): boolean {
    this._data.set(this._hash(resource), resource);
    return true;
  }

  private _hash(rs: ResourceIdentity | Resource) {
    return rs.type + "_" + rs.id;
  }
}
