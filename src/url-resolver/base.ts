export interface UrlResolverInterface {
  resolve(model: string): string
}

export class UrlResolveError implements Error {
  message: string;
  name: string;
}

export default class UrlResolverBase implements UrlResolverInterface {
  resolve(model: string): string {
    return `/${model}`;
  }
}
