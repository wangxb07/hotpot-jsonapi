# Hotpot JSONAPI Client

A lightweight jsonapi client implement by typescript.

## Demonstration

### Define schema

```typescript
const schema = new Schema({
  article: {
    type: 'node--article', // The type that defined by jsonapi server, default is the key
    primary: 'id',
    attributes: {
      title: { type: "string", as: "name" },
      body: { type: "string" },
      created: { type: "datetime" }
    },
    relationships: {
      author: { type: 'hasOne', ref: 'author'},
      field_images: {type: 'hasMany', ref: 'file', as: 'images'}
    }
  },
  author: {
    primary: 'id',
    attributes: {
      name: { type: 'string' }
    },
    relationships: {
      articles: { type: 'hasMany', ref: 'article' }
    }
  }
})
```

### Fetch a resource

```typescript

const manager: JsonapiManager = new JsonapiManager({
 schema: schema,
 host: "http://example.com/jsonapi",
 fetch: axiosFetch,
 urlResolver: new UrlResolverMapping({
   'article': '/node/node--article',
   'author': '/user/user',
 }),
 deserializer: new Deserializer({})
});

// Get single entity
const response: JsonapiResponse = manager.get('article').load(id)

const deserialized = response.deserialize();

// deserialized.id
// deserialized.title
// deserialized.author

const data: JsonapiResource = response.data()

// Identifier fields
const id = data.id
const type = data.type

// attributes
const attrs = data.attributes

// relationships
const author: JsonapiResourceIdentifier = data.getRelationship('author').getResourceIdentity();
const author_data: JsonapiResource = author.makeUp() // data.included() return JsonapiResource[]

const author_response: JsonapiResponse = await author.fetch()
const author_data = author_response.data

// links
const link: JsonapiResourceLink = data.getLink('self')
const link_response = link.fetch()

// meta
const meta = response.meta()

// error
const errors = response.errors()

```

### Fetch collection

```typescript

const query = new JsonapiQuery()
query.filter([{
  attribute: 'age',
  op: '<',
  value: 10
}])
.sort('title', '-created')
.page({ offset: 0, limit: 10 })

const response: JsonapiResponse = await manager.get('article').load(query)

const data: JsonapiResource[] = response.data()
```

### Included fetch

```typescript
...
const response: JsonapiResponseInterface = manager.get('article').included('author').load(query)
...
```

## Roadmap

- Fetching data
- Create data
- Update data
- Delete data
