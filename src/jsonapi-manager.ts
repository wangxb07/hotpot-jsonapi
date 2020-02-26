import Schema, {ModelDefinition} from "./schema";
import UrlResolverBase, {UrlResolverInterface} from "./url-resolver/base";
import JsonapiModel from "./jsonapi-model";
import {FetchOptions} from "./utils";
import JsonapiStorage, {JsonapiStorageInterface} from "./jsonapi-storage";
import {ResourceDocument} from "./resource-document";
import {SerializeOptions} from "./jsonapi-resource";

export interface DeserializerInterface {
  deserialize(res: ResourceDocument, options?: SerializeOptions): Promise<any>;
}

export interface FetchableInterface {
  fetch(url: string, options?: FetchOptions): Promise<ResourceDocument>
}

// TODO remove host
export interface JsonapiManagerOptions {
  schema: Schema;
  host: string;
  deserializer?: DeserializerInterface;
  httpClient?: FetchableInterface;
  urlResolver?: UrlResolverInterface;
}

export class NotFoundModelError implements Error {
  message: string;
  name: string;
}

export class HttpClientNotImplementedError implements Error {
  message: string;
  name: string;
}

export class DeserializerNotImplementedError implements Error {
  message: string;
  name: string;
}

export default class JsonapiManager {
  private readonly _storage: JsonapiStorageInterface;
  private readonly _schema: Schema;
  private readonly _host: string;
  private readonly _httpClient: FetchableInterface;
  private readonly _urlResolver: UrlResolverInterface;
  private _deserializer: DeserializerInterface;

  constructor(options: JsonapiManagerOptions) {
    this._schema = options.schema;
    this._urlResolver = options.urlResolver === undefined ? new UrlResolverBase() : options.urlResolver;
    this._host = options.host;
    // TODO the storage configurable
    this._storage = new JsonapiStorage(this);

    if (options.httpClient !== undefined) {
      this._httpClient = options.httpClient
    }

    if (options.deserializer !== undefined) {
      this._deserializer = options.deserializer;
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

  get storage() {
    return this._storage;
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

  getModelDefinition(name: string): ModelDefinition {
    if (!this._schema.hasModel(name)) {
      throw new NotFoundModelError()
    }

    return this._schema.getModel(name);
  }

  fetch(url: string, options?: FetchOptions): Promise<ResourceDocument> {
    if (this._httpClient === undefined) {
      throw new HttpClientNotImplementedError();
    }
    return this._httpClient.fetch(url, options);
  }

  async deserialize(res: ResourceDocument, options?: SerializeOptions): Promise<any> {
    if (this._deserializer === undefined) {
      return Promise.reject(new DeserializerNotImplementedError());
    }
    return await this._deserializer.deserialize(res, options);
  }
}
