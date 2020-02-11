import JsonapiModelManager from "./jsonapi-model-manager";
import JsonapiResponse, {JsonapiResponseInterface} from "./jsonapi-response";

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

  get manager(): JsonapiModelManager {
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

    return this._manager.fetch(url).then(json => {
      return Promise.resolve(new JsonapiResponse(json));
    });
  }

  getResourceUrl() {
    return `${this._manager.host}${this._manager.urlResolver.resolve(this._name)}`;
  }
}
