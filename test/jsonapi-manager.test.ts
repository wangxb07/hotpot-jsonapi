import {
  JsonapiManager,
  NotFoundModelError,
  JsonapiModel,
  Schema,
  Resource,
  HttpClientNotImplementedError,
  SerializerNotImplementedError
} from "../src";
import FetchAxios from "../src/plugins/fetch-axios";

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

    const m = new JsonapiManager({
      schema: schema,
      host: "http://example.com/jsonapi"
    });
    expect(m).toBeInstanceOf(JsonapiManager);

    expect(m.host).toEqual('http://example.com/jsonapi');
    expect(m.schema).toBeInstanceOf(Schema);
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

    expect(() => {
      const m = new JsonapiManager({
        schema: schema,
        host: "http://example.com/jsonapi"
      });

      m.fetch('/fackurl');
    }).toThrow(HttpClientNotImplementedError);
  });

  test('fetch implemented', () => {
    const models = {};
    const schema = new Schema(models);

    const m = new JsonapiManager({
      schema: schema,
      host: "http://example.com/jsonapi",
      httpClient: new FetchAxios(),
    });

    m.fetch('http://www.mocky.io/v2/5e4cffe02d0000db48c0d88c').then(res => {
      const data = res.data as Resource[];
      expect(data.length).toEqual(3);
      expect(data[0].id).toEqual('1');
      expect(data[0].type).toEqual('articles');
      expect(data[0].attributes.title).toEqual('JSON:API paints my bikeshed!');
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
    });

    expect(m.getModelDefinition('article')).toEqual(models['article']);
    expect(() => m.getModelDefinition('author')).toThrow(NotFoundModelError);
  });

  test('deserialize not be implemented', () => {
    const models = {};
    const schema = new Schema(models);

    expect(() => {
      const m = new JsonapiManager({
        schema: schema,
        host: "http://example.com/jsonapi"
      });

      m.deserialize({
        data: []
      });
    }).toThrow(SerializerNotImplementedError);
  });

  test('deserialize simple document', () => {
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
    const m = new JsonapiManager({
      schema: schema,
      host: "http://example.com/jsonapi",
    });
  });
});
