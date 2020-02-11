import {Resource} from "./resource-document";
import JsonapiResource from "./jsonapi-resource";

export interface JsonapiResponseInterface {
  data(): JsonapiResource | JsonapiResource[];
}

export class JsonapiStructureBroken implements Error {
  message: string;
  name: string;
}

class JsonapiResponseError implements Error {
  message: string;
  name: string;
}

export default class JsonapiResponse implements JsonapiResponseInterface {
  private readonly _originData: any;
  private _data: JsonapiResource | JsonapiResource[];

  constructor(data: any) {
    this._originData = data;
  }

  data(): JsonapiResource | JsonapiResource[] {
    if (this._data === undefined) {
      const json = this._originData;

      if (json.errors) {
        throw new JsonapiResponseError();
      }

      if (json.data === undefined) {
        throw new JsonapiStructureBroken();
      }

      this._data = new JsonapiResource(json.data)
    }

    return this._data;
  }
}
