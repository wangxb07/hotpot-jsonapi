import axios from "axios";
import FetchAxios from "../src/plugins/fetch-axios";
import {Dict} from "../src/utils";
import {
  Schema,
  ModelDefinition,
  JsonapiManager,
  JsonapiResponse,
  JsonapiResponseError,
  JsonapiQuery,
  JsonapiResource,
  JsonapiModel
} from "../src";

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('JsonapiModel', () => {
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
      }
    };

    schema_simple = new Schema(models_simple);
    manager_simple = new JsonapiManager({
      schema: schema_simple,
      host: 'http://example.com/jsonapi',
      httpClient: new FetchAxios(),
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

  test('get request url', () => {
    const model = new JsonapiModel('article', manager_simple);

    expect(model.getRequestUrl('1')).toEqual('http://example.com/jsonapi/article/1');

    expect(model.include("user.id").getRequestUrl('1'))
      .toEqual('http://example.com/jsonapi/article/1?include=user.id');

    const query = new JsonapiQuery();
    query.filter([{
      attribute: 'age',
      op: '<',
      value: 10
    }]).sort('title', '-created')
      .page({offset: 0, limit: 10});

    const m = manager_simple.get('article').include('user.id', 'role');
    expect(m.getRequestUrl(query)).toEqual("http://example.com/jsonapi/article?" +
      "filter[age][value]=10&filter[age][operator]=%3C&sort=title,-created&page[limit]=10&page[offset]=0" +
      "&include=user.id,role"
    );
  });

  test('model load by id', async () => {
    const model = new JsonapiModel('article', manager_simple);

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

  test('test errors return', async () => {
    const model = new JsonapiModel('article', manager_simple);

    mockedAxios.get.mockResolvedValue({
      "errors": [
        {
          "status": "403",
          "source": { "pointer": "/data/attributes/secretPowers" },
          "detail": "Editing secret powers is not authorized on Sundays."
        },
        {
          "status": "422",
          "source": { "pointer": "/data/attributes/volume" },
          "detail": "Volume does not, in fact, go to 11."
        },
        {
          "status": "500",
          "source": { "pointer": "/data/attributes/reputation" },
          "title": "The backend responded with an error",
          "detail": "Reputation service not responding after three requests."
        }
      ]
    });

    const res = await model.load('1');

    expect(res).toBeInstanceOf(JsonapiResponse);
    expect(() => {
      res.data()
    }).toThrow(JsonapiResponseError);
    expect(res.errors().length).toEqual(3);
    expect(res.errors()[0].status).toEqual('403');
  }, 1000);

  test('fetch collection of model by simple query', async () => {
    mockedAxios.get.mockResolvedValue({
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
    });

    const query = new JsonapiQuery();
    query.filter([{
      attribute: 'age',
      op: '<',
      value: 10
    }]).sort('title', '-created')
      .page({offset: 0, limit: 10});

    const m = manager_simple.get('article');
    expect(m.getRequestUrl(query)).toEqual("http://example.com/jsonapi/article?" +
      "filter[age][value]=10&filter[age][operator]=%3C&sort=title,-created&page[limit]=10&page[offset]=0");

    const response = await m.load(query);
    expect(response).toBeInstanceOf(JsonapiResponse);

    const data = response.data();

    expect((data as Array<JsonapiResource>).length).toEqual(2);
    const d1 = (data as Array<JsonapiResource>)[0];

    expect(d1.id).toEqual("1");
    expect(d1.attributes.title).toEqual("JSON:API paints my bikeshed!");
  });
});
