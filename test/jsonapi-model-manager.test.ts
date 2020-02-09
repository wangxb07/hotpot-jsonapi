import Schema from "../src/schema";
import JsonapiModelManager from "../src/jsonapi-model-manager";

describe('JsonapiModelManager', () => {
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

    const model = new JsonapiModelManager({
      schema: schema,
      host: "http://example.com/jsonapi"
    });
    expect(model).toBeInstanceOf(JsonapiModelManager);

    expect(model.host).toEqual('http://example.com/jsonapi');
    expect(model.schema).toBeInstanceOf(Schema);
  });
});
