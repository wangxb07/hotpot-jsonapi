// import fetchAxios from "./plugins/fetch-axios"
//
// export const plugins = {
//   fetchAxios
// };

export {
  ResourceLink,
  ResourceLinkObject,
  Resource,
  ResourceIdentity,
  ResourceRelationship,
  ResourceHasManyRelationship,
  ResourceHasOneRelationship,
  ResourceDocument,
  Error
} from "./resource-document";

export {
  default as Schema,
  RelationshipReferenceError,
  ModelDefinition,
  AttributeDefinition,
  RelationshipDefinition,
  TypeConflictError
} from "./schema";

export {
  default as JsonapiManager,
  NotFoundModelError,
  JsonapiManagerOptions,
  DeserializerInterface,
  FetchableInterface,
  HttpClientNotImplementedError,
  DeserializerNotImplementedError
} from "./jsonapi-manager";

export {
  default as JsonapiModel,
  ModelInterface
} from "./jsonapi-model";

export {
  default as JsonapiStorage,
  JsonapiStorageInterface
} from "./jsonapi-storage";

export {
  default as JsonapiQuery,
  JsonapiQueryInterface,
  FilterDefinition,
  PageDefinition
} from "./jsonapi-query";

export {
  default as JsonapiResponse,
  JsonapiResponseInterface,
  JsonapiResponseError,
  JsonapiStructureBroken
} from "./jsonapi-response";

export {
  default as JsonapiResource,
  SerializeOptions,
  LinkGetter,
  LinkNotFoundError,
  RelationshipGetter,
  RelationshipNotFoundError
} from "./jsonapi-resource";

export {
  default as JsonapiResourceIdentity, Makeupable
} from "./jsonapi-resource-identity";

export {
  default as JsonapiResourceRelationship
} from "./jsonapi-resource-relationship";

export {
  default as JsonapiResourceLink
} from "./jsonapi-resource-link";

export {
  UrlResolverInterface, UrlResolveError, UrlResolverMapping, UrlResolverBase
} from "./url-resolver/"
