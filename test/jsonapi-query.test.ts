import JsonapiQuery from "../src/jsonapi-query";

describe('JsonapiQuery', () => {
  test('path generate with filters', () => {
    const q = new JsonapiQuery();

    q.filter({
      attribute: 'name',
      value: 'Hello Jsonapi world!'
    });

    expect(q.path()).toEqual("?filter[name][value]=Hello%20Jsonapi%20world!");

    q.filter([{
      attribute: 'name',
      value: 'Hello Jsonapi world!'
    }, {
      attribute: 'status',
      value: 'published'
    }]);

    expect(q.path()).toEqual("?filter[name][value]=Hello%20Jsonapi%20world!&filter[status][value]=published");

    q.filter([{
      attribute: 'name',
      value: 'Hello',
      op: 'CONTAIN'
    }, {
      attribute: 'status',
      value: 'published',
      op: '>'
    }]);

    expect(q.path()).toEqual("?filter[name][value]=Hello&filter[name][operator]=CONTAIN&filter[status][value]=published&filter[status][operator]=%3E");
  });

  test('path generate with sorts', () => {
    const q = new JsonapiQuery();

    q.sort("name");
    expect(q.path()).toEqual("?sort=name");

    q.sort("name", "-created");
    expect(q.path()).toEqual("?sort=name,-created");
  });

  test('path generate with pagination', () => {
    const q = new JsonapiQuery();

    q.page({
      offset: 0,
      limit: 0,
    });
    expect(q.path()).toEqual("");

    q.page({
      offset: 1,
      limit: 10,
    });
    expect(q.path()).toEqual("?page[limit]=10&page[offset]=1");
  });

  test('path generate with complex', () => {
    const q = new JsonapiQuery();

    q.filter([{
      attribute: 'name',
      value: 'Hello',
      op: 'CONTAIN'
    }, {
      attribute: 'status',
      value: 'published',
      op: '>'
    }]).page({
      offset: 1,
      limit: 10,
    }).sort("-created");

    expect(q.path()).toEqual("?filter[name][value]=Hello" +
      "&filter[name][operator]=CONTAIN&filter[status][value]=published&filter[status][operator]=%3E" +
      "&sort=-created" +
      "&page[limit]=10&page[offset]=1"
    );
  });
});
