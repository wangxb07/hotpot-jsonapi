import {Dict} from "../src/utils";
import Schema, {ModelDefinition} from "../src/schema";
import JsonapiModelManager from "../src/jsonapi-model-manager";
import axiosFetch from "../src/plugins/fetch-axios";
import JsonapiResponse from "../src/jsonapi-response";

describe('JsonapiResponse', () => {
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
      host: 'http://example.com/jsonapi',
      fetch: axiosFetch,
    })
  });

  test('can be instantiated by single resource', () => {
    const res = new JsonapiResponse({
      "links": {
        "self": "http://example.com/articles",
        "next": "http://example.com/articles?page[offset]=2",
        "last": "http://example.com/articles?page[offset]=10"
      },
      "data": {
        "type": "article",
        "id": "1",
        "attributes": {
          "title": "JSON:API paints my bikeshed!"
        },
        "relationships": {
          "author": {
            "links": {
              "self": "http://example.com/articles/1/relationships/author",
              "related": "http://example.com/articles/1/author"
            },
            "data": { "type": "people", "id": "9" }
          }
        },
        "links": {
          "self": "http://example.com/articles/1"
        }
      }
    }, manager_simple);

    expect(res).toBeInstanceOf(JsonapiResponse);
  });

  test('can be instantiated by multi resource', () => {
    const res = new JsonapiResponse({
      "links": {
        "self": "http://example.com/articles",
        "next": "http://example.com/articles?page[offset]=2",
        "last": "http://example.com/articles?page[offset]=10"
      },
      "data": [{
        "type": "article",
        "id": "1",
        "attributes": {
          "title": "JSON:API paints my bikeshed!"
        }
      },{
        "type": "article",
        "id": "2",
        "attributes": {
          "title": "JSON:API paints my bikeshed!"
        }
      }]
    }, manager_simple);

    expect(res).toBeInstanceOf(JsonapiResponse);
  })
});
