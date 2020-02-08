import { Dict } from "./utils";

export interface ResourceIdentity {
  id: string;
  type: string;
}

export interface ResourceLink {
  href: string;
  meta?: Dict<any>;
}

export interface ResourceHasOneRelationship {
  data?: ResourceIdentity | null;
  meta?: Dict<any>;
  links?: Dict<ResourceLink>;
}

export interface ResourceHasManyRelationship {
  data?: ResourceIdentity[];
  meta?: Dict<any>;
  links?: Dict<ResourceLink>;
}

export type ResourceRelationship =
  | ResourceHasOneRelationship
  | ResourceHasManyRelationship;

export interface Resource {
  id?: string;
  type: string;
  attributes?: Dict<any>;
  relationships?: Dict<ResourceRelationship>;
  meta?: Dict<any>;
  links?: Dict<ResourceLink>;
}

export interface ResourceDocument {
  data: Resource | Resource[] | ResourceIdentity | ResourceIdentity[];
  included?: Resource[];
  meta?: Dict<any>;
  links?: Dict<ResourceLink>;
}