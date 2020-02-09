import {UrlResolverInterface, UrlResloveError} from "./base";
import {Dict} from "../utils";

export default class UrlResloverMapping implements UrlResolverInterface {
  private readonly _mapping: Dict<string>;

  constructor(mapping: Dict<string>) {
    this._mapping = mapping
  }

  resolve(model: string): string {
    if (this._mapping[model] === undefined) {
      throw new UrlResloveError()
    }

    return this._mapping[model]
  }
}
