import {ModelDefinition} from "./schema";

interface JsonapiResponseInterface {
}

interface JsonapiQueryInterface {
}

export interface ModelInterface {
  load(query: string | JsonapiQueryInterface): Promise<JsonapiResponseInterface>;
  included(models: string | string[]): ModelInterface;
}

export default class JsonapiModel implements ModelInterface {
  private _definition: ModelDefinition;

  constructor(model: ModelDefinition) {
    this._definition = model
  }

  included(models: string | string[]): ModelInterface {
    return undefined;
  }

  load(query: string | JsonapiQueryInterface): Promise<JsonapiResponseInterface> {
    return undefined;
  }
}
