import Schema, {ModelDefinition} from "./schema";
import UrlResolverBase, {UrlResolverInterface} from "./url-resolver/base";
import JsonapiModel from "./jsonapi-model";
import {FetchOptions} from "./fetch";


type FetchFunc = (url: string, options?: FetchOptions) => Promise<any>;

export interface JsonapiManagerOptions {
  schema: Schema;
  host: string;
  fetch?: FetchFunc;
  urlResolver?: UrlResolverInterface;
}

export class NotFoundModelError implements Error {
  message: string;
  name: string;
}

export default class JsonapiManager {
  private readonly _schema: Schema;
  private readonly _urlResolver: UrlResolverInterface;
  private readonly _host: string;
  private readonly _fetch: FetchFunc;

  constructor(options: JsonapiManagerOptions) {
    this._schema = options.schema;
    this._urlResolver = options.urlResolver === undefined ? new UrlResolverBase() : options.urlResolver;
    this._host = options.host;

    if (options.fetch === undefined) {
      this._fetch = (url: string, options: FetchOptions) => {
        return new Promise((resolve, reject) => {
          reject('fetch func not be implemented');
        });
      }
    }
    else {
      this._fetch = options.fetch
    }
  }

  get schema(): Schema {
    return this._schema;
  }

  get host() {
    return this._host;
  }

  get urlResolver() {
    return this._urlResolver;
  }

  /**
   * Get model
   * @param model
   */
  get(model: string): JsonapiModel {
    if (!this._schema.hasModel(model)) {
      throw new NotFoundModelError()
    }

    return new JsonapiModel(model, this);
  }

  fetch(url: string, options?: FetchOptions) {
    return this._fetch(url, options);
  }

  getModelDefinition(name: string): ModelDefinition {
    if (!this._schema.hasModel(name)) {
      throw new NotFoundModelError()
    }

    return this._schema.models[name];
  }
}
