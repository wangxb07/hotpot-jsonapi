import Schema from "../src/schema";
import JsonapiManager, {NotFoundModelError} from "../src/jsonapi-manager";
import JsonapiModel from "../src/jsonapi-model";
import axiosFetch from "../src/plugins/fetch-axios";

describe('JsonapiManager', () => {
  test('can be instantiated', () => {
    const models = {
      article: {
        attributes: {
          title: {type: "string"},
          body: {type: "string"},
          created: {type: "datetime"}
        }
      }
    };

    const schema = new Schema(models);

    const model = new JsonapiManager({
      schema: schema,
      host: "http://example.com/jsonapi"
    });
    expect(model).toBeInstanceOf(JsonapiManager);

    expect(model.host).toEqual('http://example.com/jsonapi');
    expect(model.schema).toBeInstanceOf(Schema);
  });

  test('generate model from manager', () => {
    const models = {
      article: {
        attributes: {
          title: {type: "string"},
          body: {type: "string"},
          created: {type: "datetime"}
        }
      }
    };

    const schema = new Schema(models);

    const model = new JsonapiManager({
      schema: schema,
      host: "http://example.com/jsonapi"
    });

    const m = model.get('article');
    expect(m).toBeInstanceOf(JsonapiModel);
    expect(m.manager).toEqual(model);
    expect(m.name).toEqual('article');

    expect(() => {model.get('author')}).toThrow(NotFoundModelError);
  });

  test('fetch not be implemented', () => {
    const models = {};
    const schema = new Schema(models);

    const model = new JsonapiManager({
      schema: schema,
      host: "http://example.com/jsonapi"
    });

    model.fetch('http://fakeurl.com/').then(res => {

    }).catch(e => {
      expect(e).toEqual('fetch func not be implemented');
    })
  });

  test('fetch implemented', () => {
    const models = {};
    const schema = new Schema(models);

    const model = new JsonapiManager({
      schema: schema,
      host: "http://example.com/jsonapi",
      fetch: axiosFetch,
    });

    model.fetch('https://raw.githubusercontent.com/wangxb07/hotpot-jsonapi/master/package.json').then(res => {
      expect(res.name).toEqual('hotpot-jsonapi');
    });
  });

  test('get model definition by model name', () => {
    const models = {
      article: {
        attributes: {
          title: {type: "string"},
        }
      }
    };

    const schema = new Schema(models);

    const m = new JsonapiManager({
      schema: schema,
      host: "http://example.com/jsonapi",
      fetch: axiosFetch,
    });

    expect(m.getModelDefinition('article')).toEqual(models['article']);
    expect(() => m.getModelDefinition('author')).toThrow(NotFoundModelError);
  });
});
