import {ResourceLink} from "./resource-document";
import {Dict} from "./utils";
import JsonapiResponse from "./jsonapi-response";
import JsonapiModelManager from "./jsonapi-model-manager";

export interface Fetchable {
  fetch(): Promise<JsonapiResponse>
}

export default class JsonapiResourceLink implements ResourceLink, Fetchable {
  href: string;
  meta: Dict<any>;
  private readonly _manager: JsonapiModelManager;

  constructor(manager: JsonapiModelManager) {
    this._manager = manager;
  }

  fetch(): Promise<JsonapiResponse> {
    return this._manager.fetch(this.href).then(json => {
      return new JsonapiResponse(json, this._manager);
    });
  }
}
