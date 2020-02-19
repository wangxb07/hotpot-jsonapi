import {ResourceLink, ResourceLinkObject} from "./resource-document";
import {Dict} from "./utils";
import JsonapiResponse from "./jsonapi-response";
import JsonapiManager from "./jsonapi-manager";

export default class JsonapiResourceLink implements ResourceLinkObject {
  href: string;
  meta: Dict<any>;
  private readonly _manager: JsonapiManager;

  constructor(link: ResourceLink, manager: JsonapiManager) {
    this._manager = manager;

    if (typeof link === 'string') {
      this.href = link;
    }
    else {
      this.href = link.href;

      if (link.meta !== undefined) {
        this.meta = link.meta;
      }
    }
  }

  fetch(): Promise<JsonapiResponse> {
    return this._manager.fetch(this.href).then(json => {
      return new JsonapiResponse(json, this._manager);
    });
  }
}
