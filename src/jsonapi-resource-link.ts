import {ResourceLink} from "./resource-document";
import {Dict} from "./utils";
import JsonapiResponse from "./jsonapi-response";
import JsonapiManager from "./jsonapi-manager";

export interface Fetchable {
  fetch(): Promise<JsonapiResponse>
}

export default class JsonapiResourceLink implements ResourceLink, Fetchable {
  href: string;
  meta: Dict<any>;
  private readonly _manager: JsonapiManager;

  constructor(manager: JsonapiManager) {
    this._manager = manager;
  }

  fetch(): Promise<JsonapiResponse> {
    return this._manager.fetch(this.href).then(json => {
      return new JsonapiResponse(json, this._manager);
    });
  }
}
