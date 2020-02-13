import JsonapiResource from "./jsonapi-resource";

interface Makeupable {
  makeup(): JsonapiResource;
}

export default class JsonapiResourceIdentity implements Makeupable {
  makeup(): JsonapiResource {
    throw new Error("Method not implemented.");
  }
}
