import {ResourceDocument, ResourceLink} from "./resource-document";
import JsonapiResource, {LinkNotFoundError, SerializeOptions} from "./jsonapi-resource";
import {ModelDefinition} from "./schema";
import {Error as JsonapiError} from "./resource-document";
import JsonapiManager, {DeserializerInterface} from "./jsonapi-manager";
import JsonapiResourceLink from "./jsonapi-resource-link";
import {Dict} from "./utils";

export interface JsonapiResponseInterface {
  data(): JsonapiResource | JsonapiResource[];

  errors(): JsonapiError[];

  getLink(name: string): JsonapiResourceLink;

  deserialize(options?: SerializeOptions): any;
}

export class JsonapiStructureBroken implements Error {
  message: string;
  name: string;
}

export class JsonapiResponseError implements Error {
  message: string;
  name: string;
}

export default class JsonapiResponse implements JsonapiResponseInterface, DeserializerInterface {
  private readonly _resource: JsonapiResource | JsonapiResource[];
  private readonly _originData: ResourceDocument;
  private readonly _model: ModelDefinition;
  private _links: Dict<ResourceLink>;
  private _manager: JsonapiManager;

  constructor(json: any, manager: JsonapiManager) {
    this._originData = json;
    this._manager = manager;

    if (json.errors === undefined) {
      let data;

      if (Array.isArray(json.data)) {
        data = json.data[0];
      } else {
        data = json.data;
      }

      if (data === undefined ||
        data.type === undefined ||
        data.id === undefined) {
        throw new JsonapiStructureBroken();
      }

      this._model = manager.getModelDefinition(data.type);

      if (Array.isArray(json.data)) {
        this._resource = json.data.map((d: any) => {
          return new JsonapiResource(d, manager)
        })
      } else {
        this._resource = new JsonapiResource(data, manager);
      }

      if (json.links !== undefined) {
        this._links = json.links;
      }
    }
  }

  data(): JsonapiResource | JsonapiResource[] {
    if (this._resource === undefined) {
      throw new JsonapiResponseError()
    }
    return this._resource;
  }

  get links(): Dict<ResourceLink> {
    return this._links;
  }

  errors(): JsonapiError[] {
    if (this._originData.errors === undefined) {
      return [];
    }

    return this._originData.errors;
  }

  getLink(name: string): JsonapiResourceLink {
    if (this._links[name] === undefined) {
      throw new LinkNotFoundError();
    }

    return new JsonapiResourceLink(this._links[name], this._manager);
  }

  deserialize(options?: SerializeOptions) {
    return this._manager.deserialize(this._originData, options);
  }
}
