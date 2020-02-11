import {Resource, ResourceDocument, ResourceIdentity, ResourceLink, ResourceRelationship} from "./resource-document";
import {Dict} from "./utils";
import {ModelDefinition} from "./schema";
import JsonapiResourceLink from "./jsonapi-resource-link";
import JsonapiResourceRelationship from "./jsonapi-resource-relationship";

export interface SerializeOptions {
}

export interface Serializable {
  serialize(options: SerializeOptions): any
}

export interface RelationshipGetter {
  getRelationship(name: string): JsonapiResourceRelationship;
}

export interface LinkGetter {
  getLink(name: string): JsonapiResourceLink;
}

export default class JsonapiResource implements Resource, Serializable, RelationshipGetter, LinkGetter {
  attributes: Dict<any>;
  meta: Dict<any>;

  private readonly _id: string;
  private readonly _type: string;
  private readonly _links: Dict<ResourceLink>;
  private readonly _relationships: Dict<ResourceRelationship>;
  private readonly _data: Resource;
  private readonly _model: ModelDefinition;

  constructor(data: Resource, model: ModelDefinition) {
    this.attributes = data.attributes;
    this.meta = data.meta;

    this._data = data;
    this._id = data.id;
    this._type = data.type;
    this._links = data.links;
    this._relationships = data.relationships;

    this._model = model;
  }

  serialize(options: SerializeOptions): any {
    // TODO
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

  getRelationship(name: string): JsonapiResourceRelationship {
    throw new Error("Method not implemented.");
  }

  getLink(name: string): JsonapiResourceLink {
    throw new Error("Method not implemented.");
  }
}
