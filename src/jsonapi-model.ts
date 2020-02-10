import {ModelDefinition} from "./schema";
import JsonapiModelManager from "./jsonapi-model-manager";

interface JsonapiResponseInterface {
}

interface JsonapiQueryInterface {
}

export interface ModelInterface {
  load(query: string | JsonapiQueryInterface): Promise<JsonapiResponseInterface>;
  included(models: string | string[]): ModelInterface;
}

export default class JsonapiModel implements ModelInterface {
  private readonly _manager: JsonapiModelManager;
  private readonly _name: string;

  constructor(name: string, manager: JsonapiModelManager) {
    this._name = name;
    this._manager = manager;
  }

  get name(): string {
    return this._name;
  }

  get manager(): JsonapiModelManager {
    return this._manager;
  }

  included(models: string | string[]): ModelInterface {
    return undefined;
  }

  load(query: string | JsonapiQueryInterface): Promise<JsonapiResponseInterface> {
    return undefined;
  }

  getResourceUrl() {
    return `${this._manager.host}${this._manager.urlResolver.resolve(this._name)}`;
  }
}
