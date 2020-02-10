import UrlResolverBase, {UrlResolveError} from "../src/url-resolver/base";
import UrlResolverMapping from "../src/url-resolver/mapping";

describe('UrlResolver', () => {
  test('base url resolver simple resolve', () => {
    const resolver = new UrlResolverBase();
    const path = resolver.resolve('article');

    expect(path).toEqual('/article');
  });

  test('mapping url resolver simple resolve', () => {
    const resolver = new UrlResolverMapping({
      'article': '/node/node--article',
      'author': '/user/user',
    });

    expect(resolver.resolve('article')).toEqual('/node/node--article');
    expect(resolver.resolve('author')).toEqual('/user/user');

    const t = () => {
      resolver.resolve('unknown')
    };
    expect(t).toThrow(UrlResolveError);
  })
});
