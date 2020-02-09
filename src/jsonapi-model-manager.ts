import Schema from "./schema";
import UrlResolverBase, {UrlResolverInterface} from "./url-resolver/base";

export interface JsonapiModelManagerOptions {
  schema: Schema;
  host: string;
  urlResolver?: UrlResolverInterface;
}

export default class JsonapiModelManager {
  private readonly _schema: Schema;
  private readonly _urlResolver: UrlResolverInterface;
  private readonly _host: string;

  constructor(options: JsonapiModelManagerOptions) {
    this._schema = options.schema;
    this._urlResolver = options.urlResolver === undefined ? new UrlResolverBase() : options.urlResolver;
    this._host = options.host;
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
  get(model: string) {

  }
}
