import JsonapiResource from "./jsonapi-resource";
import {JsonapiResponseInterface} from "./jsonapi-response";
import JsonapiManager from "./jsonapi-manager";
import {ResourceIdentity} from "./resource-document";

export interface Makeupable {
  makeup(): JsonapiResource;
  fetch(): Promise<JsonapiResponseInterface>;
}

export default class JsonapiResourceIdentity implements Makeupable {
  private _manager: JsonapiManager;
  private readonly _resourceIdentity: ResourceIdentity;

  constructor(resourceIdentity: ResourceIdentity,  manager: JsonapiManager) {
    this._resourceIdentity = resourceIdentity;
    this._manager = manager;
  }

  async fetch(): Promise<JsonapiResponseInterface> {
    return await this._manager.get(this._resourceIdentity.type).load(this._resourceIdentity.id);
  }

  makeup(): JsonapiResource {
    return this._manager.storage.find(this._resourceIdentity);
  }
}
