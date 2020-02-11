import JsonapiModel from "../src/jsonapi-model";
import Schema, {ModelDefinition} from "../src/schema";
import JsonapiModelManager from "../src/jsonapi-model-manager";
import axios from "axios";
import axiosFetch from "../src/plugins/fetch-axios";
import {Dict} from "../src/utils";
import JsonapiResponse from "../src/jsonapi-response";

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

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
      host: 'http://example.com/jsonapi',
      fetch: axiosFetch,
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

    mockedAxios.get.mockImplementationOnce(() => Promise.resolve({
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
    }));

    const res = await model.load('1');

    expect(res).toBeInstanceOf(JsonapiResponse);

    const data = res.data();

    // @ts-ignore
    expect(data.id).toEqual('1');
    // @ts-ignore
    expect(data.type).toEqual('article');
    // @ts-ignore
    expect(data.attributes.title).toEqual('JSON:API paints my bikeshed!');

  }, 1000);
});
