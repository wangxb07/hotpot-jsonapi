import JsonapiManager from "./jsonapi-manager";
import JsonapiResponse, {JsonapiResponseInterface} from "./jsonapi-response";
import {ModelDefinition} from "./schema";
import JsonapiQuery, {JsonapiQueryInterface} from "./jsonapi-query";

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
    let url;
    if (typeof query === 'string') {
      url = this.getResourceUrl() + '/' + query;
    }

    if (query instanceof JsonapiQuery) {
      url = this.getResourceUrl() + query.path();
    }

    return this._manager.fetch(url).then(json => {
      return Promise.resolve(new JsonapiResponse(json, this._manager));
    });
  }

  getResourceUrl() {
    return `${this._manager.host}${this._manager.urlResolver.resolve(this._name)}`;
  }
}
