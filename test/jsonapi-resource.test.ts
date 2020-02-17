import {Dict} from "../src/utils";
import axiosFetch from "../src/plugins/fetch-axios";
import axios from "axios";
import {
  JsonapiResource,
  LinkNotFoundError,
  RelationshipNotFoundError,
  Schema,
  ModelDefinition,
  JsonapiManager,
  JsonapiResourceRelationship
} from "../src";

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('JsonapiResource', () => {
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

  test("jsonapi resource can be instantiated", () => {
    const rs = new JsonapiResource({
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
    }, manager_simple);

    expect(rs).toBeInstanceOf(JsonapiResource);
    expect(rs.id).toEqual("1");
    expect(rs.type).toEqual("article");
    expect(rs.attributes.title).toEqual("JSON:API paints my bikeshed!");
  });

  test("get link", async () => {
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
        "links": {
          "self": "http://example.com/article/1"
        },
      }
    });

    const rs = new JsonapiResource({
      "type": "article",
      "id": "1",
      "attributes": {
        "title": "JSON:API paints my bikeshed!",
        "body": "The shortest article. Ever.",
        "created": "2015-05-22T14:56:29.000Z",
        "updated": "2015-05-22T14:56:28.000Z"
      },
      "links": {
        "self": "http://example.com/article/1"
      },
      "relationships": {
        "author": {
          "data": {"id": "42", "type": "people"}
        }
      }
    }, manager_simple);

    const self = rs.getLink('self');
    expect(self.href).toEqual("http://example.com/article/1");

    const res = await self.fetch();
    expect((res.data() as JsonapiResource).id).toEqual("1");

    expect(() => rs.getLink('unknown')).toThrow(LinkNotFoundError);
  }, 1000);

  test("get relationship", () => {
    const rs = new JsonapiResource({
      "type": "article",
      "id": "1",
      "attributes": {
        "title": "JSON:API paints my bikeshed!",
        "body": "The shortest article. Ever.",
        "created": "2015-05-22T14:56:29.000Z",
        "updated": "2015-05-22T14:56:28.000Z"
      },
      "links": {
        "self": "http://example.com/article/1"
      },
      "relationships": {
        "author": {
          "data": {"id": "42", "type": "people"}
        }
      }
    }, manager_simple);

    const author_id = rs.getRelationship('author');
    expect(author_id).toBeInstanceOf(JsonapiResourceRelationship);
    expect(() => rs.getRelationship('unknown')).toThrow(RelationshipNotFoundError);
  });
});
