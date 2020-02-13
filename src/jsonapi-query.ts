export interface FilterDefinition {
  op?: string;
  value: string | number;
  attribute: string;
}

export interface PageDefinition {
  offset?: number;
  limit?: number;
}

export interface JsonapiQueryInterface {
  path(): string;
  filter(filters: FilterDefinition[]): JsonapiQueryInterface;
  page(page: PageDefinition): JsonapiQueryInterface;
  sort(...attributes: string[]): JsonapiQueryInterface;
}

const separator = (p: string) => (p.length ? '&' : '?');

export default class JsonapiQuery implements JsonapiQueryInterface {
  private _filters: FilterDefinition[];
  private _page: PageDefinition;
  private _sorts: string[];

  constructor() {
    this._filters = [];
    this._page = {
      limit: 0,
      offset: 0
    };
    this._sorts = [];
  }

  filter(filters: FilterDefinition | FilterDefinition[]): JsonapiQueryInterface {
    if (Array.isArray(filters)) {
      this._filters = filters;
    } else {
      this._filters = [filters];
    }
    return this;
  }

  page(page: PageDefinition): JsonapiQueryInterface {
    this._page = page;
    return this;
  }

  path(): string {
    let path = "";
    path = this._filters.reduce((p, filter) => {
      p = p + separator(p)
        + `filter[${encodeURIComponent(filter.attribute)}][value]=${encodeURIComponent(filter.value)}`;
      if (filter.op !== undefined) {
        p = p + `&filter[${encodeURIComponent(filter.attribute)}][operator]=${encodeURIComponent(filter.op)}`;
      }
      return p;
    }, path);

    if (this._sorts.length > 0) {
      path = path + separator(path) + this._sorts.join(",");
    }

    if (this._page.limit !== 0 || this._page.offset !== 0) {
      path = path + separator(path) + `page[limit]=${this._page.limit}&page[offset]=${this._page.offset}`;
    }

    return path;
  }

  sort(...attributes: string[]): JsonapiQueryInterface {
    this._sorts = attributes;
    return this;
  }
}
