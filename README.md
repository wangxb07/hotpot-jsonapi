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
      body: { type: "string" }
      created: { type: "datetime" }
    }
    relationships: {
      author: { ref: '#author' }
    }
  },
  author: {
    primary: 'id',
    attributes: {
      name: { type: 'string' }
    }
    relationships: {
      articles: { type: 'array', items: { ref: '#article' } }
    }
  }
})
```

### Fetch a resource

```typescript

const model: JsonapiModel = createJsonapiModel(schema)

// Get single entity
const response: JsonapiResponse = model('article').load(id)

const data: Resource = response.data()

// Identifier fields
const id = data.id
const type = data.type

// attributes
const attrs = data.attributes()

// or attributes with processor
const attrs = data.attributes({
  keyConversion: '' // Options include: dash-case (default),
                    // lisp-case, spinal-case, kebab-case,
                    // underscore_case, snake_case, camelCase, CamelCase,
  serializer: [DateTimeSerializer]
})

// relationships
const author: ResourceIdentifier = data.relationships('author').data()
const data: Resource = author.makeUp(data.included()) // data.included() return Resource[]

const author_response: JsonapiResponse = await author.fetch()
const author_data = author_response.data()

// links
const link: ResourceLink = data.links('self')
const link_response = links.fetch()

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

const response: JsonapiResponse = model('article').load(query)

const data: Resource[] = response.data()
```

### Included fetch

```typescript
...
const response: JsonapiResponse = model('article').included('author').load(query)
...
```

## Roadmap

- Fetching data
- Create data
- Update data
- Delete data
