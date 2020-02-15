import {Dict} from "../src/utils";
import Schema, {ModelDefinition} from "../src/schema";
import JsonapiManager from "../src/jsonapi-manager";
import axiosFetch from "../src/plugins/fetch-axios";
import axios from "axios";
import JsonapiResourceIdentity from "../src/jsonapi-resource-identity";
import JsonapiResponse from "../src/jsonapi-response";
import JsonapiResource from "../src/jsonapi-resource";
import JsonapiModel from "../src/jsonapi-model";

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('JsonapiResourceIdentity', () => {
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

  test('resource identity makeup self by fetch', async () => {
    mockedAxios.get.mockResolvedValue({
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
        "links": {
          "self": "http://example.com/articles/1"
        }
      }
    });

    const res_id = new JsonapiResourceIdentity({
      "type": "article", "id": "1"
    }, manager_simple);

    const res = await res_id.fetch();
    expect(res).toBeInstanceOf(JsonapiResponse);

    const d = res.data();

    // @ts-ignore
    expect(d.id).toEqual("1");
    // @ts-ignore
    expect(d.type).toEqual("article");
    // @ts-ignore
    expect(d.attributes.title).toEqual("JSON:API paints my bikeshed!");

  }, 1000);

  test('resource identity makeup self by params', async () => {
    const model = new JsonapiModel('article', manager_simple);

    mockedAxios.get.mockResolvedValue({
      "data": {
        "type": "article",
        "id": "1",
        "attributes": {
          "title": "JSON:API paints my bikeshed!",
          "body": "The shortest article. Ever.",
          "created": "2015-05-22T14:56:29.000Z",
          "updated": "2015-05-22T14:56:28.000Z"
        },
        "relationships": {
          "author": {
            "data": {"id": "42", "type": "people"}
          }
        }
      },
      "included": [
        {
          "type": "people",
          "id": "42",
          "attributes": {
            "name": "John",
            "age": 80,
            "gender": "male"
          }
        }
      ]
    });

    const res = await model.load('1');
    const resource = res.data() as JsonapiResource;

    let author_id = resource.getRelationship('author').getResourceIdentity();
    expect(author_id).toBeInstanceOf(JsonapiResourceIdentity);

    author_id = (author_id as JsonapiResourceIdentity);
    const author = author_id.makeup();

    expect(author.id).toEqual("42");
    expect(author.type).toEqual("people");
    expect(author.attributes.name).toEqual("John");
  }, 1000);
});
