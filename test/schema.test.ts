import {Schema, RelationshipReferenceError, TypeConflictError, UrlResolverMapping} from "../src/index";
import FetchAxios from "../src/plugins/fetch-axios";
import {Deserializer} from "ts-jsonapi";
import JsonapiManager from "../src/jsonapi-manager";

describe('Schema', () => {
  test('can be instantiated', () => {
    const schema = new Schema({});
    expect(schema).toBeInstanceOf(Schema);
  });

  test('standard model initialize', () => {
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

    expect(schema.models.article).toBeDefined();
    expect(schema.models.article.attributes).toBeDefined();
    expect(schema.models.article.attributes.title.type).toEqual('string');
    expect(schema.models.article.primary).toEqual('id');
    expect(schema.models.article.type).toEqual('article');
  });

  test('custom type and primary model initialize', () => {
    const models = {
      article: {
        type: 'node--article',
        primary: 'uuid',
      }
    };

    const schema = new Schema(models);

    expect(schema.models.article.primary).toEqual('uuid');
    expect(schema.models.article.type).toEqual('node--article');
  });

  test('multiple model initialize', () => {
    const models = {
      article: {
        attributes: {
          title: {type: "string"},
          body: {type: "string"},
          created: {type: "datetime"}
        }
      },
      author: {
        attributes: {
          name: {type: 'string'}
        }
      }
    };

    const schema = new Schema(models);

    expect(Object.keys(schema.models).length).toEqual(2);
    expect(schema.models.author).toBeDefined();
    expect(schema.models.author.attributes).toBeDefined();
    expect(schema.models.author.attributes.name.type).toEqual('string');
  });

  test('model relationship reference check failure', () => {
    const models = {
      article: {
        attributes: {
          title: {type: "string"}
        },
        relationships: {
          author: { type: 'hasOne', ref: 'author'}
        }
      }
    };

    const t = () => {
      const schema = new Schema(models);
    };

    expect(t).toThrow(RelationshipReferenceError);
  });

  test('model relationship reference check success', () => {
    const models = {
      article: {
        attributes: {
          title: {type: "string"}
        },
        relationships: {
          author: { type: 'hasOne', ref: 'author'}
        }
      },
      author: {
        attributes: {
          name: {type: 'string'}
        }
      }
    };

    const schema = new Schema(models);

    expect(Object.keys(schema.models).length).toEqual(2);
    expect(Object.keys(schema.models)).toContain('article');
    expect(Object.keys(schema.models)).toContain('author');

    expect(schema.models.article.relationships.author).toBeDefined();
  });

  test('schema has model or no model', () => {
    const models = {
      article: {
        attributes: {
          title: {type: "string"}
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

    const schema = new Schema(models);

    expect(schema.hasModel('article')).toBeTruthy();
    expect(schema.hasModel('author')).toBeFalsy();

    expect(schema.hasModel('store')).toBeTruthy();
    expect(schema.hasModel('commerce_store--online')).toBeTruthy();
    expect(schema.hasModel('commerce_store')).toBeFalsy();
  });

  test('type conflict error', () => {
    const models = {
      article: {
        attributes: {
          title: {type: "string"}
        }
      },
      store: {
        type: 'article',
        attributes: {
          name:{ type: "string" },
        }
      }
    };

    expect(() => new Schema(models)).toThrow(TypeConflictError);
  });

  test('get model name', () => {
    const models = {
      article: {
        type: 'article',
        attributes: {
          title: {type: "string"}
        }
      },
      store: {
        type: 'commerce_store--online',
        attributes: {
          name:{ type: "string" },
        }
      }
    };

    const schema = new Schema(models);

    expect(schema.getName('commerce_store--online')).toEqual('store');
    expect(schema.getName('article')).toEqual('article');
  });

  test('test', async () => {
    const schema = new Schema({
      store:{
        type: 'commerce_store--offline',
        primary: 'id',
        attributes: {
          name: {type: "string"},
          mail: {type: "string"},
        },
      },
      fieldListImage: {
        type: 'file',
      },
      order: {
        type: 'commerce_order--default'
      },
      offlineOrder: {
        type: 'commerce_order--offline'
      },
      coupon: {
        type: 'commerce_promotion_coupon--commerce_promotion_coupon'
      },
      comment: {
        type: 'comment--order_comment'
      },
      term: {
        type: 'taxonomy_term--business_scope'
      },
    })

    const manager = new JsonapiManager({
      schema: schema,
      host: "https://s1.beehomeplus.cn:8443/gdlf",
      httpClient: new FetchAxios(),
      deserializer: new Deserializer({
        keyForAttribute: 'camelCase',
      }),
      urlResolver: new UrlResolverMapping({
        'store': '/jsonapi/commerce_store/offline',
        'order': '/jsonapi/commerce_order/default',
        'comment': '/jsonapi/comment/order_comment',
        'term': '/jsonapi/taxonomy_term/business_scope',
        'offlineOrder': '/jsonapi/commerce_order/offline',
      })
    })
    await manager.get('offlineOrder').load('42b94417-47f3-4105-bca9-e79f471658fa');
  }, 10000)

});
