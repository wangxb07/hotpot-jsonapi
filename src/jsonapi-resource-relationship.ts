import {
  ResourceHasOneRelationship,
  ResourceHasManyRelationship,
  ResourceIdentity,
  ResourceLink
} from "./resource-document";
import {Dict} from "./utils";
import JsonapiManager from "./jsonapi-manager";
import JsonapiResourceIdentity from "./jsonapi-resource-identity";

export default class JsonapiResourceRelationship implements ResourceHasOneRelationship, ResourceHasManyRelationship {
  private readonly _data: ResourceIdentity | ResourceIdentity[];
  private readonly _meta: Dict<any>;
  private readonly _links: Dict<ResourceLink>;
  private readonly _manager: JsonapiManager;

  constructor(json: any, manager: JsonapiManager) {
    this._data = json.data;
    this._links = json.links;
    if (json.meta !== undefined) {
      this._meta = json.meta;
    }

    this._manager = manager;
  }

  get links(): Dict<ResourceLink> {
    return this._links;
  }
  get meta(): Dict<any> {
    return this._meta;
  }

  getResourceIdentity(): JsonapiResourceIdentity | JsonapiResourceIdentity[] {
    if (Array.isArray(this._data)) {
      return this._data.map((d) => {
        return new JsonapiResourceIdentity(d, this._manager);
      });
    }

    return new JsonapiResourceIdentity(this._data, this._manager);
  }
}
