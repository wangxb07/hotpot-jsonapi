export interface UrlResolverInterface {
  resolve(model: string): string
}

export class UrlResloveError implements Error {
  message: string;
  name: string;
}

export default class UrlResolverBase implements UrlResolverInterface {
  resolve(model: string): string {
    return `/${model}`;
  }
}
