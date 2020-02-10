import JsonapiModel from "../src/jsonapi-model";
import Schema, {ModelDefinition} from "../src/schema";
import JsonapiModelManager from "../src/jsonapi-model-manager";
import {Dict} from "../src/utils";

describe('JsonapiModel', () => {
  let models_simple: Dict<ModelDefinition>,
    schema_simple: Schema,
    manager_simple: JsonapiModelManager;

  beforeAll(() => {
    models_simple = {
      article: {
        attributes: {
          title: {type: "string"},
          body: {type: "string"},
          created: {type: "datetime"}
        }
      }
    };

    schema_simple = new Schema(models_simple);
    manager_simple = new JsonapiModelManager({
      schema: schema_simple,
      host: 'http://example.com/jsonapi'
    })
  });

  test('can be instantiated', () => {
    const model = new JsonapiModel('article', manager_simple);
    expect(model).toBeInstanceOf(JsonapiModel);
  });

  test('get resource url', () => {
    const model = new JsonapiModel('article', manager_simple);

    const url = model.getResourceUrl();
    expect(url).toEqual('http://example.com/jsonapi/article');
  });

  test('model load by id', async () => {
    const model = new JsonapiModel('article', manager_simple);

    await model.load('10');
  }, 1000);
});
