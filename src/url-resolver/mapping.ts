import {UrlResolverInterface, UrlResolveError} from "./base";
import {Dict} from "../utils";

export default class UrlResolverMapping implements UrlResolverInterface {
  private readonly _mapping: Dict<string>;

  constructor(mapping: Dict<string>) {
    this._mapping = mapping
  }

  resolve(model: string): string {
    if (this._mapping[model] === undefined) {
      throw new UrlResolveError()
    }

    return this._mapping[model]
  }
}
