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
});
