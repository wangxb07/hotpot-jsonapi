import {Dict} from "../src/utils";
import FetchAxios from "../src/plugins/fetch-axios";

import {
  Schema,
  ModelDefinition,
  JsonapiManager,
  JsonapiResponse,
  JsonapiResource,
  LinkNotFoundError,
  JsonapiResourceLink
} from "../src";
// @ts-ignore
import {jsonapi_store} from "../mock";

describe('JsonapiResponse', () => {
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
        }
      },
      store: {
        type: 'commerce_store--online',
        primary: 'id',
        attributes: {
          name:{ type: "string" },
          mail:{ type: "string" },
          address: { type: "string" }
        }
      }
    };

    schema_simple = new Schema(models_simple);
    manager_simple = new JsonapiManager({
      schema: schema_simple,
      host: 'http://example.com/jsonapi',
      httpClient: new FetchAxios(),
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
        },
        "links": {
          "self": "http://example.com/articles/1"
        }
      }, {
        "type": "article",
        "id": "2",
        "attributes": {
          "title": "JSON:API paints your bikeshed!"
        },
        "links": {
          "self": "http://example.com/articles/2"
        }
      }]
    }, manager_simple);

    expect(res).toBeInstanceOf(JsonapiResponse);

    const data = res.data() as JsonapiResource[];

    expect(data.length).toEqual(2);
    expect(data[1].id).toEqual("2");
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
  });

  test('response get link', () => {
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

    const self = res.getLink('self');
    expect(self).toBeInstanceOf(JsonapiResourceLink);
    expect(self.href).toEqual("http://example.com/articles");

    expect(() => res.getLink("unknown")).toThrow(LinkNotFoundError);

    const links = res.links;
    expect(links.next).toEqual("http://example.com/articles?page[offset]=2");
  });

  test('complex structures', () => {
    const res = new JsonapiResponse(jsonapi_store, manager_simple);
    expect(res).toBeInstanceOf(JsonapiResponse);

    const d = res.data();
    expect((d as Array<JsonapiResource>).length).toEqual(3);
    const d1 = (d as Array<JsonapiResource>)[0];
    expect(d1.id).toEqual('5b25da2e-2eb2-428d-a6eb-501f8c3a84dc');
    expect(d1.attributes.name).toEqual('91shuichan');
  });
});
