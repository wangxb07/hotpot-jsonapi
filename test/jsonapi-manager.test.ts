import {
  JsonapiManager,
  NotFoundModelError,
  JsonapiModel,
  Schema,
  Resource,
  HttpClientNotImplementedError,
  DeserializerNotImplementedError
} from "../src";
import FetchAxios from "../src/plugins/fetch-axios";
import { Deserializer } from "ts-jsonapi";

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

    expect(async () => {
      const m = new JsonapiManager({
        schema: schema,
        host: "http://example.com/jsonapi"
      });

      await m.deserialize({
        data: []
      }).catch(e => {
        expect(e).toBeInstanceOf(DeserializerNotImplementedError)
      });
    })
  });

  test('deserialize simple document', async () => {
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
      deserializer: new Deserializer()
    });

    const res = await m.deserialize({
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
    });

    expect(res.id).toEqual("1");
    expect(res.title).toEqual("JSON:API paints my bikeshed!");
  }, 1000);

  test('deserialize document with included ', async () => {
    const models = {
      article: {
        type: "articles",
        attributes: {
          title: {type: "string"}
        },
        relationships: {
          author: {"type": "hasOne", ref: "people"},
          comments: {"type": "hasMany", ref: "comment"}
        }
      },
      people: {
        attributes: {
          firstName: {type: "string"},
          lastName: {type: "string"},
        }
      },
      comment: {
        type: 'comments',
        attributes: {
          body: {type: "string"}
        },
        relationships: {
          author: {"type": "hasOne", ref: "people"},
        }
      }
    };
    const schema = new Schema(models);
    const m = new JsonapiManager({
      schema: schema,
      host: "http://example.com/jsonapi",
      deserializer: new Deserializer({
        keyForAttribute: 'camelCase'
      })
    });

    const res: any[] = await m.deserialize({
      "links": {
        "self": "http://example.com/articles",
        "next": "http://example.com/articles?page[offset]=2",
        "last": "http://example.com/articles?page[offset]=10"
      },
      "data": [{
        "type": "articles",
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
            "data": {"type": "people", "id": "9"}
          },
          "comments": {
            "links": {
              "self": "http://example.com/articles/1/relationships/comments",
              "related": "http://example.com/articles/1/comments"
            },
            "data": [
              {"type": "comments", "id": "5"},
              {"type": "comments", "id": "12"}
            ]
          }
        },
        "links": {
          "self": "http://example.com/articles/1"
        }
      }],
      "included": [{
        "type": "people",
        "id": "9",
        "attributes": {
          "firstName": "Dan",
          "lastName": "Gebhardt",
          "twitter": "dgeb"
        },
        "links": {
          "self": "http://example.com/people/9"
        }
      }, {
        "type": "comments",
        "id": "5",
        "attributes": {
          "body": "First!"
        },
        "relationships": {
          "author": {
            "data": {"type": "people", "id": "2"}
          }
        },
        "links": {
          "self": "http://example.com/comments/5"
        }
      }, {
        "type": "comments",
        "id": "12",
        "attributes": {
          "body": "I like XML better"
        },
        "relationships": {
          "author": {
            "data": {"type": "people", "id": "9"}
          }
        },
        "links": {
          "self": "http://example.com/comments/12"
        }
      }]
    });

    expect(res[0].id).toEqual("1");
    expect(res[0].title).toEqual("JSON:API paints my bikeshed!");
    expect(res[0].author.firstName).toEqual("Dan");
    expect(res[0].author.lastName).toEqual("Gebhardt");
    expect(res[0].comments.length).toEqual(2);
    expect(res[0].comments[0].body).toEqual("First!");
  }, 1000);
});
