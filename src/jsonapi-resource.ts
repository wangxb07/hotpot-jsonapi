import {Resource, ResourceDocument, ResourceIdentity, ResourceLink, ResourceRelationship} from "./resource-document";
import {Dict} from "./utils";
import {ModelDefinition} from "./schema";
import JsonapiResourceLink from "./jsonapi-resource-link";
import JsonapiResourceRelationship from "./jsonapi-resource-relationship";
import JsonapiManager from "./jsonapi-manager";

export interface SerializeOptions {
}

export interface RelationshipGetter {
  getRelationship(name: string, manager: JsonapiManager): JsonapiResourceRelationship;
}

export interface LinkGetter {
  getLink(name: string): JsonapiResourceLink;
}

export class RelationshipNotFoundError implements Error {
  message: string;
  name: string;
}

export default class JsonapiResource implements Resource, RelationshipGetter, LinkGetter {
  attributes: Dict<any>;
  meta: Dict<any>;

  private readonly _id: string;
  private readonly _type: string;
  private readonly _links: Dict<ResourceLink>;
  private readonly _relationships: Dict<ResourceRelationship>;
  private readonly _data: Resource;
  private readonly _manager: JsonapiManager;
  private _model: ModelDefinition;

  constructor(data: Resource, manager: JsonapiManager) {
    this.attributes = data.attributes;
    this.meta = data.meta;

    this._data = data;
    this._id = data.id;
    this._type = data.type;
    this._links = data.links;
    this._relationships = data.relationships;

    this._manager = manager;
    this._model = this._manager.getModelDefinition(data.type);
  }

  get links(): Dict<ResourceLink> {
    return this._links;
  }
  get type(): string {
    return this._type;
  }
  get id(): string {
    return this._id;
  }
  get relationships(): Dict<ResourceRelationship> {
    return this._relationships;
  }

  getLink(name: string): JsonapiResourceLink {
    throw new Error("Method not implemented.");
  }

  getRelationship(name: string): JsonapiResourceRelationship {
    if (this._relationships[name] === undefined) {
      throw new RelationshipNotFoundError();
    }

    return new JsonapiResourceRelationship(this._relationships[name], this._manager);
  }
}
