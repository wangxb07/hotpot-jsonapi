import JsonapiManager from "./jsonapi-manager";
import JsonapiResponse, {JsonapiResponseInterface} from "./jsonapi-response";
import {ModelDefinition} from "./schema";
import JsonapiQuery, {JsonapiQueryInterface} from "./jsonapi-query";
import {ResourceDocument, Resource, ResourceIdentity} from "./resource-document";

export interface ModelInterface {
  load(query: string | JsonapiQueryInterface): Promise<JsonapiResponseInterface>;
  included(models: string | string[]): ModelInterface;
}

export default class JsonapiModel implements ModelInterface {
  private readonly _manager: JsonapiManager;
  private readonly _name: string;
  private readonly _model: ModelDefinition;

  constructor(name: string, manager: JsonapiManager) {
    this._name = name;
    this._manager = manager;
    this._model = manager.getModelDefinition(this._name);
  }

  get manager(): JsonapiManager {
    return this._manager;
  }

  get name(): string {
    return this._name;
  }

  included(models: string | string[]): ModelInterface {
    return undefined;
  }

  load(query: string | JsonapiQueryInterface): Promise<JsonapiResponseInterface> {
    return this._manager.fetch(this.getRequestUrl(query)).then((json: ResourceDocument) => {
      this.afterLoad(json);
      return new JsonapiResponse(json, this._manager);
    });
  }

  getRequestUrl(query: string | JsonapiQueryInterface): string {
    let url;
    if (typeof query === 'string') {
      url = this.getResourceUrl() + '/' + query;
    }
    if (query instanceof JsonapiQuery) {
      url = this.getResourceUrl() + query.path();
    }
    return url;
  }

  getResourceUrl() {
    return `${this._manager.host}${this._manager.urlResolver.resolve(this._name)}`;
  }

  private afterLoad(json: ResourceDocument) {
    if (json.data !== undefined) {
      if (Array.isArray(json.data)) {
        json.data.forEach((d: any) => {
          this._manager.storage.insert(d);
        });
      } else {
        // @ts-ignore
        this._manager.storage.insert(json.data);
      }
    }

    if (json.included !== undefined) {
      json.included.forEach((d: any) => {
        this._manager.storage.insert(d);
      });
    }
  }
}
