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
      title: { type: "string" },
      body: { type: "string" },
      created: { type: "datetime" }
    },
    relationships: {
      author: { type: 'hasOne', ref: 'author' }
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

const model: JsonapiManager = new JsonapiManager({
 schema: schema,
 host: "http://example.com/jsonapi",
 fetch: axiosFetch,
});

// Get single entity
const response: JsonapiResponse = model.get('article').load(id)

const data: JsonapiResource = response.data()

// Identifier fields
const id = data.id
const type = data.type

// attributes
const attrs = data.attributes

// or attributes with processor
const attrs = data.serialize({
  keyConversion: '', // Options include: dash-case (default),
                    // lisp-case, spinal-case, kebab-case,
                    // underscore_case, snake_case, camelCase, CamelCase,
  serializers: [DateTimeSerializer]
})

// relationships
const author: JsonapiResourceIdentifier = data.getRelationship('author').data
const data: JsonapiResource = author.makeUp(data.included()) // data.included() return JsonapiResource[]

const author_response: JsonapiResponse = await author.fetch()
const author_data = author_response.data

// links
const link: ResourceLink = data.links('self')
const link_response = link.fetch()

// meta
const meta = response.meta()

// error
const errors = response.errors()

```

### Fetch collection

```typescript

const query = new JsonapiQuery()
query.filters([{
  attribute: 'age',
  op: '<',
  value: 10
}])
.sort('title', '-created')
.page({ offset: 0, limit: 10 }))

const response: JsonapiResponse = model.get('article').load(query)

const data: JsonapiResource[] = response.data()
```

### Included fetch

```typescript
...
const response: JsonapiResponse = model.get('article').included('author').load(query)
...
```

## Roadmap

- Fetching data
- Create data
- Update data
- Delete data
