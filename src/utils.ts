/**
 * A simple dictionary interface.
 *
 * @export
 * @interface Dict
 * @template T
 */
export interface Dict<T> {
    [key: string]: T;
}

export type Method =
  | 'get' | 'GET'
  | 'delete' | 'DELETE'
  | 'head' | 'HEAD'
  | 'options' | 'OPTIONS'
  | 'post' | 'POST'
  | 'put' | 'PUT'
  | 'patch' | 'PATCH'
  | 'link' | 'LINK'
  | 'unlink' | 'UNLINK'

export interface FetchOptions {
    method?: Method;
    headers?: any;
    body?: any;
    mode?: "cors" | "no-cors" | "same-origin";
    credentials?: "omit" | "same-origin" | "include";
    cache?: "default" | "no-store" | "reload" | "no-cache" | "force-cache" | "only-if-cached";
    redirect?: "follow" | "error" | "manual";
    referrer?: string;
    referrerPolicy?: "referrer" | "no-referrer-when-downgrade" | "origin" | "origin-when-cross-origin" | "unsafe-url";
    integrity?: any;
}

declare enum ResponseType {
    Basic,
    Cors,
    Default,
    Error,
    Opaque
}

export interface Headers {
    append(name: string, value: string): void;

    delete(name: string): void;

    get(name: string): string;

    getAll(name: string): Array<string>;

    has(name: string): boolean;

    set(name: string, value: string): void;
}

export interface Body {
    bodyUsed: boolean;

    arrayBuffer(): Promise<ArrayBuffer>;

    blob(): Promise<any>;

    formData(): Promise<any>;

    json(): Promise<JSON>;

    text(): Promise<string>;
}

export interface Response extends Body {
    error(): Response;

    redirect(url: string, status?: number): Response;

    type: ResponseType;
    url: string;
    status: number;
    ok: boolean;
    statusText: string;
    headers: Headers;

    clone(): Response;
}
