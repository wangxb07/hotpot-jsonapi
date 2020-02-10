import Schema from "./schema";
import UrlResolverBase, {UrlResolverInterface} from "./url-resolver/base";
import JsonapiModel from "./jsonapi-model";

export type Method =
  | 'get' | 'GET'
  | 'delete' | 'DELETE'
  | 'head' | 'HEAD'
  | 'options' | 'OPTIONS'
  | 'post' | 'POST'
  | 'put' | 'PUT'
  | 'patch' | 'PATCH'
  | 'link' | 'LINK'
  | 'unlink' | 'UNLINK'

export interface FetchOptions {
  method?: Method;
  headers?: any;
  body?: any;
  mode?: "cors" | "no-cors" | "same-origin";
  credentials?: "omit" | "same-origin" | "include";
  cache?: "default" | "no-store" | "reload" | "no-cache" | "force-cache" | "only-if-cached";
  redirect?: "follow" | "error" | "manual";
  referrer?: string;
  referrerPolicy?: "referrer" | "no-referrer-when-downgrade" | "origin" | "origin-when-cross-origin" | "unsafe-url";
  integrity?: any;
}

type FetchFunc = (url: string, options?: FetchOptions) => Promise<any>;

export interface JsonapiModelManagerOptions {
  schema: Schema;
  host: string;
  fetch?: FetchFunc;
  urlResolver?: UrlResolverInterface;
}

export class NotFoundModelError implements Error {
  message: string;
  name: string;
}

export default class JsonapiModelManager {
  private readonly _schema: Schema;
  private readonly _urlResolver: UrlResolverInterface;
  private readonly _host: string;
  private readonly _fetch: FetchFunc;

  constructor(options: JsonapiModelManagerOptions) {
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
    return this._fetch(url, options)
  }
}
