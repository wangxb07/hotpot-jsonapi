import {Dict} from "./utils";


export interface AttributeDefinition {
  type?: string;
}

export interface RelationshipDefinition {
  type: string | 'hasOne' | 'hasMany';
  ref: string | string[];
}

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
    return this._models[model] !== undefined;
  }
}
