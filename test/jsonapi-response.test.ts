import {Dict} from "../src/utils";
import axiosFetch from "../src/plugins/fetch-axios";

import {
  Schema,
  ModelDefinition,
  JsonapiManager,
  JsonapiResponse,
  JsonapiResource,
  LinkNotFoundError,
  JsonapiResourceLink
} from "../src";

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
    const res = new JsonapiResponse({
      "jsonapi": {"version": "1.0", "meta": {"links": {"self": {"href": "http:\/\/jsonapi.org\/format\/1.0\/"}}}},
      "data": [{
        "type": "commerce_store--online",
        "id": "5b25da2e-2eb2-428d-a6eb-501f8c3a84dc",
        "links": {"self": {"href": "https:\/\/s1.beehomeplus.cn:9443\/zh-hans\/jsonapi\/commerce_store\/online\/5b25da2e-2eb2-428d-a6eb-501f8c3a84dc"}},
        "attributes": {
          "drupal_internal__store_id": 1,
          "langcode": "en",
          "name": "91shuichan",
          "mail": "admin@91shuichan.cn",
          "timezone": "UTC",
          "address": {
            "langcode": "",
            "country_code": "CN",
            "administrative_area": "Zhejiang Sheng",
            "locality": "Ningbo Shi",
            "dependent_locality": "Yinzhou Qu",
            "postal_code": "315800",
            "sorting_code": null,
            "address_line1": "xx",
            "address_line2": "",
            "organization": null,
            "given_name": null,
            "additional_name": null,
            "family_name": null
          },
          "billing_countries": ["CN"],
          "path": {"alias": null, "pid": null, "langcode": "en"},
          "is_default": true,
          "default_langcode": true,
          "shipping_countries": []
        },
        "relationships": {
          "commerce_store_type": {
            "data": {
              "type": "commerce_store_type--commerce_store_type",
              "id": "bfbd4569-fbba-479f-bb8d-7cb483f43679"
            },
            "links": {
              "related": {"href": "https:\/\/s1.beehomeplus.cn:9443\/zh-hans\/jsonapi\/commerce_store\/online\/5b25da2e-2eb2-428d-a6eb-501f8c3a84dc\/commerce_store_type"},
              "self": {"href": "https:\/\/s1.beehomeplus.cn:9443\/zh-hans\/jsonapi\/commerce_store\/online\/5b25da2e-2eb2-428d-a6eb-501f8c3a84dc\/relationships\/commerce_store_type"}
            }
          },
          "uid": {
            "data": {"type": "user--user", "id": "ef44f985-042a-49c5-b9e7-47571e9cf81d"},
            "links": {
              "related": {"href": "https:\/\/s1.beehomeplus.cn:9443\/zh-hans\/jsonapi\/commerce_store\/online\/5b25da2e-2eb2-428d-a6eb-501f8c3a84dc\/uid"},
              "self": {"href": "https:\/\/s1.beehomeplus.cn:9443\/zh-hans\/jsonapi\/commerce_store\/online\/5b25da2e-2eb2-428d-a6eb-501f8c3a84dc\/relationships\/uid"}
            }
          },
          "default_currency": {
            "data": {
              "type": "commerce_currency--commerce_currency",
              "id": "c4657556-e6a4-4ffa-9ba0-dcb64b8a83e0"
            },
            "links": {
              "related": {"href": "https:\/\/s1.beehomeplus.cn:9443\/zh-hans\/jsonapi\/commerce_store\/online\/5b25da2e-2eb2-428d-a6eb-501f8c3a84dc\/default_currency"},
              "self": {"href": "https:\/\/s1.beehomeplus.cn:9443\/zh-hans\/jsonapi\/commerce_store\/online\/5b25da2e-2eb2-428d-a6eb-501f8c3a84dc\/relationships\/default_currency"}
            }
          },
          "field_wechat_app": {
            "data": null,
            "links": {
              "related": {"href": "https:\/\/s1.beehomeplus.cn:9443\/zh-hans\/jsonapi\/commerce_store\/online\/5b25da2e-2eb2-428d-a6eb-501f8c3a84dc\/field_wechat_app"},
              "self": {"href": "https:\/\/s1.beehomeplus.cn:9443\/zh-hans\/jsonapi\/commerce_store\/online\/5b25da2e-2eb2-428d-a6eb-501f8c3a84dc\/relationships\/field_wechat_app"}
            }
          }
        }
      }, {
        "type": "commerce_store--online",
        "id": "3b934de4-28c9-47e3-aa23-234372dce865",
        "links": {"self": {"href": "https:\/\/s1.beehomeplus.cn:9443\/zh-hans\/jsonapi\/commerce_store\/online\/3b934de4-28c9-47e3-aa23-234372dce865"}},
        "attributes": {
          "drupal_internal__store_id": 2,
          "langcode": "zh-hans",
          "name": "greenboss",
          "mail": "wangzixu001@outlook.com",
          "timezone": "UTC",
          "address": {
            "langcode": "zh-hans",
            "country_code": "CN",
            "administrative_area": "Zhejiang Sheng",
            "locality": "Ningbo Shi",
            "dependent_locality": "Cixi Shi",
            "postal_code": "315000",
            "sorting_code": null,
            "address_line1": "xxx",
            "address_line2": "",
            "organization": null,
            "given_name": null,
            "additional_name": null,
            "family_name": null
          },
          "billing_countries": ["CN"],
          "path": {"alias": null, "pid": null, "langcode": "zh-hans"},
          "is_default": false,
          "default_langcode": true,
          "shipping_countries": []
        },
        "relationships": {
          "commerce_store_type": {
            "data": {
              "type": "commerce_store_type--commerce_store_type",
              "id": "bfbd4569-fbba-479f-bb8d-7cb483f43679"
            },
            "links": {
              "related": {"href": "https:\/\/s1.beehomeplus.cn:9443\/zh-hans\/jsonapi\/commerce_store\/online\/3b934de4-28c9-47e3-aa23-234372dce865\/commerce_store_type"},
              "self": {"href": "https:\/\/s1.beehomeplus.cn:9443\/zh-hans\/jsonapi\/commerce_store\/online\/3b934de4-28c9-47e3-aa23-234372dce865\/relationships\/commerce_store_type"}
            }
          },
          "uid": {
            "data": {"type": "user--user", "id": "ef44f985-042a-49c5-b9e7-47571e9cf81d"},
            "links": {
              "related": {"href": "https:\/\/s1.beehomeplus.cn:9443\/zh-hans\/jsonapi\/commerce_store\/online\/3b934de4-28c9-47e3-aa23-234372dce865\/uid"},
              "self": {"href": "https:\/\/s1.beehomeplus.cn:9443\/zh-hans\/jsonapi\/commerce_store\/online\/3b934de4-28c9-47e3-aa23-234372dce865\/relationships\/uid"}
            }
          },
          "default_currency": {
            "data": {
              "type": "commerce_currency--commerce_currency",
              "id": "c4657556-e6a4-4ffa-9ba0-dcb64b8a83e0"
            },
            "links": {
              "related": {"href": "https:\/\/s1.beehomeplus.cn:9443\/zh-hans\/jsonapi\/commerce_store\/online\/3b934de4-28c9-47e3-aa23-234372dce865\/default_currency"},
              "self": {"href": "https:\/\/s1.beehomeplus.cn:9443\/zh-hans\/jsonapi\/commerce_store\/online\/3b934de4-28c9-47e3-aa23-234372dce865\/relationships\/default_currency"}
            }
          },
          "field_wechat_app": {
            "data": {
              "type": "wechat_merchant--wechat_merchant",
              "id": "46a98f6f-22a2-4af1-897d-e848ba30d1a2"
            },
            "links": {
              "related": {"href": "https:\/\/s1.beehomeplus.cn:9443\/zh-hans\/jsonapi\/commerce_store\/online\/3b934de4-28c9-47e3-aa23-234372dce865\/field_wechat_app"},
              "self": {"href": "https:\/\/s1.beehomeplus.cn:9443\/zh-hans\/jsonapi\/commerce_store\/online\/3b934de4-28c9-47e3-aa23-234372dce865\/relationships\/field_wechat_app"}
            }
          }
        }
      }, {
        "type": "commerce_store--online",
        "id": "2e2d7b4e-d359-475b-80c7-2d4f48ed5953",
        "links": {"self": {"href": "https:\/\/s1.beehomeplus.cn:9443\/zh-hans\/jsonapi\/commerce_store\/online\/2e2d7b4e-d359-475b-80c7-2d4f48ed5953"}},
        "attributes": {
          "drupal_internal__store_id": 3,
          "langcode": "zh-hans",
          "name": "yongwei",
          "mail": "admin@yongwei.cn",
          "timezone": "Asia\/Shanghai",
          "address": {
            "langcode": "zh-hans",
            "country_code": "CN",
            "administrative_area": "Zhejiang Sheng",
            "locality": "Ningbo Shi",
            "dependent_locality": "Beilun Qu",
            "postal_code": "315000",
            "sorting_code": null,
            "address_line1": "\u65b0\u78b6\u8857\u9053\u65b0\u5927\u8def708\u53f7",
            "address_line2": "",
            "organization": null,
            "given_name": null,
            "additional_name": null,
            "family_name": null
          },
          "billing_countries": ["CN"],
          "path": {"alias": null, "pid": null, "langcode": "zh-hans"},
          "is_default": false,
          "default_langcode": true,
          "shipping_countries": ["CN"]
        },
        "relationships": {
          "commerce_store_type": {
            "data": {
              "type": "commerce_store_type--commerce_store_type",
              "id": "bfbd4569-fbba-479f-bb8d-7cb483f43679"
            },
            "links": {
              "related": {"href": "https:\/\/s1.beehomeplus.cn:9443\/zh-hans\/jsonapi\/commerce_store\/online\/2e2d7b4e-d359-475b-80c7-2d4f48ed5953\/commerce_store_type"},
              "self": {"href": "https:\/\/s1.beehomeplus.cn:9443\/zh-hans\/jsonapi\/commerce_store\/online\/2e2d7b4e-d359-475b-80c7-2d4f48ed5953\/relationships\/commerce_store_type"}
            }
          },
          "uid": {
            "data": {"type": "user--user", "id": "ef44f985-042a-49c5-b9e7-47571e9cf81d"},
            "links": {
              "related": {"href": "https:\/\/s1.beehomeplus.cn:9443\/zh-hans\/jsonapi\/commerce_store\/online\/2e2d7b4e-d359-475b-80c7-2d4f48ed5953\/uid"},
              "self": {"href": "https:\/\/s1.beehomeplus.cn:9443\/zh-hans\/jsonapi\/commerce_store\/online\/2e2d7b4e-d359-475b-80c7-2d4f48ed5953\/relationships\/uid"}
            }
          },
          "default_currency": {
            "data": {
              "type": "commerce_currency--commerce_currency",
              "id": "c4657556-e6a4-4ffa-9ba0-dcb64b8a83e0"
            },
            "links": {
              "related": {"href": "https:\/\/s1.beehomeplus.cn:9443\/zh-hans\/jsonapi\/commerce_store\/online\/2e2d7b4e-d359-475b-80c7-2d4f48ed5953\/default_currency"},
              "self": {"href": "https:\/\/s1.beehomeplus.cn:9443\/zh-hans\/jsonapi\/commerce_store\/online\/2e2d7b4e-d359-475b-80c7-2d4f48ed5953\/relationships\/default_currency"}
            }
          },
          "field_wechat_app": {
            "data": {
              "type": "wechat_merchant--wechat_merchant",
              "id": "c05a5db7-c66b-4680-9bbf-ec5a15ed7515"
            },
            "links": {
              "related": {"href": "https:\/\/s1.beehomeplus.cn:9443\/zh-hans\/jsonapi\/commerce_store\/online\/2e2d7b4e-d359-475b-80c7-2d4f48ed5953\/field_wechat_app"},
              "self": {"href": "https:\/\/s1.beehomeplus.cn:9443\/zh-hans\/jsonapi\/commerce_store\/online\/2e2d7b4e-d359-475b-80c7-2d4f48ed5953\/relationships\/field_wechat_app"}
            }
          }
        }
      }],
      "meta": {"count": "3"},
      "links": {"self": {"href": "https:\/\/s1.beehomeplus.cn:9443\/jsonapi\/commerce_store\/online"}}
    }, manager_simple);
    expect(res).toBeInstanceOf(JsonapiResponse);

    const d = res.data();
    expect((d as Array<JsonapiResource>).length).toEqual(3);
    const d1 = (d as Array<JsonapiResource>)[0];
    expect(d1.id).toEqual('5b25da2e-2eb2-428d-a6eb-501f8c3a84dc');
    expect(d1.attributes.name).toEqual('91shuichan');
  });
});
