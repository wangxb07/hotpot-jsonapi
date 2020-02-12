import {ResourceLink} from "./resource-document";
import JsonapiResource from "./jsonapi-resource";
import {ModelDefinition} from "./schema";
import {Error as JsonapiError} from "./resource-document";
import JsonapiManager from "./jsonapi-manager";

export interface JsonapiResponseInterface {
  data(): JsonapiResource | JsonapiResource[];

  errors(): JsonapiError[];

  links(): ResourceLink;
}

export class JsonapiStructureBroken implements Error {
  message: string;
  name: string;
}

export class JsonapiResponseError implements Error {
  message: string;
  name: string;
}

export default class JsonapiResponse implements JsonapiResponseInterface {
  private readonly _resource: JsonapiResource | JsonapiResource[];
  private readonly _originData: any;
  private readonly _model: ModelDefinition;

  constructor(json: any, manager: JsonapiManager) {
    this._originData = json;

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
      this._resource = new JsonapiResource(data, this._model);
    }
  }

  data(): JsonapiResource | JsonapiResource[] {
    if (this._resource === undefined) {
      throw new JsonapiResponseError()
    }
    return this._resource;
  }

  errors(): JsonapiError[] {
    if (this._originData.errors === undefined) {
      return [];
    }

    return this._originData.errors;
  }

  links(): ResourceLink {
    throw new Error("Method not implemented.");
  }
}
