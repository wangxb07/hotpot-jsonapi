import {Dict} from "../src/utils";
import Schema, {ModelDefinition} from "../src/schema";
import JsonapiManager from "../src/jsonapi-manager";
import axiosFetch from "../src/plugins/fetch-axios";
import JsonapiStorage from "../src/jsonapi-storage";

describe('JsonapiStorage', () => {
  let models_simple: Dict<ModelDefinition>,
    schema_simple: Schema,
    manager_simple: JsonapiManager;

  beforeAll(() => {
    models_simple = {
      article: {
        attributes: {
          title: {type: "string"},
          body: {type: "string"},
          created: {type: "datetime"}
        },
        relationships: {
          author: {"type": "hasOne", ref: "people"}
        }
      },
      people: {
        attributes: {
          name: {type: "string"},
        }
      }
    };

    schema_simple = new Schema(models_simple);
    manager_simple = new JsonapiManager({
      schema: schema_simple,
      host: 'http://example.com/jsonapi',
      fetch: axiosFetch,
    })
  });

  test('can be instantiated', () => {
    const storage = new JsonapiStorage(manager_simple);
    expect(storage).toBeInstanceOf(JsonapiStorage);
  });

  test('find by resource identity', () => {
    const storage = new JsonapiStorage(manager_simple);
    storage.insert({
      "type": "article",
      "id": "1",
      "attributes": {
        "title": "JSON:API paints my bikeshed!"
      },
      "relationships": {
        "author": {
          "data": {"type": "people", "id": "9"}
        }
      },
      "links": {}
    });
    storage.insert({
      "type": "people",
      "id": "9",
      "attributes": {
        "name": "barry wang"
      },
      "links": {}
    });
    const res = storage.find({"type": "article", "id": "1"});
    expect(res.attributes.title).toEqual("JSON:API paints my bikeshed!");

    const notfound_res = storage.find({type: "article", id: "2"});
    expect(notfound_res).toBeNull();

    const people_res = storage.find({type: "people", id: "9"});
    expect(people_res.attributes.name).toEqual('barry wang');
  });
});
