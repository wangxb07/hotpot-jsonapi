import {Dict} from "./utils";
import JsonapiModel from "./jsonapi-model";


export interface AttributeDefinition {
  type?: string;
}

export interface RelationshipDefinition {
  type: string | 'hasOne' | 'hasMany';
  ref: string | string[];
}

// TODO Consider serializer in model definition
export interface ModelDefinition {
  type?: string;
  primary?: string;
  attributes?: Dict<AttributeDefinition>;
  relationships?: Dict<RelationshipDefinition>;
}

export class RelationshipReferenceError implements Error {
  message: string;
  name: string;
}

export default class Schema {
  private _models: Dict<ModelDefinition>;

  constructor(models: Dict<ModelDefinition>) {
    // process models
    this._initModels(models);
  }

  get models(): Dict<ModelDefinition> {
    return this._models;
  }

  /**
   * init models
   * @param models
   * @private
   */
  private _initModels(models: Dict<ModelDefinition>) {
    const relationshipCheck = (r: string) => {
      if (Object.keys(models).findIndex(name => r === name) === -1) {
        throw new RelationshipReferenceError()
      }
    };

    Object.keys(models).forEach((key: string) => {
      const m = models[key];

      if (m.type === undefined) {
        m.type = key;
      }

      if (m.primary === undefined) {
        m.primary = 'id';
      }

      // scan relationships
      if (m.relationships !== undefined) {
        Object.keys(m.relationships).forEach(i => {
          if (Array.isArray(m.relationships[i].ref)) {
            const refs: string[] = m.relationships[i].ref as Array<string>;
            refs.forEach(relationshipCheck)
          } else {
            relationshipCheck(m.relationships[i].ref as string);
          }
        })
      }
    });

    this._models = models;
  }

  hasModel(model: string) {
    let has = this._models[model] !== undefined;
    if (!has) {
      const result = Object.keys(this._models).findIndex((k) => {
        return this._models[k].type == model
      });

      has = result >= 0;
    }

    return has;
  }

  getModel(model: string): ModelDefinition {
    let m = this._models[model];

    if (m === undefined) {
      const k = Object.keys(this._models).find((k) => {
        return this._models[k].type === model
      });

      m = this._models[k];
    }

    return m;
  }
}
