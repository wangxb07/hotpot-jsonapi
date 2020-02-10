import {FetchOptions} from "../../src/jsonapi-model-manager";
import axios, {AxiosRequestConfig} from "axios";

export default (url: string, options?: FetchOptions) => {
  let axiosOptions: AxiosRequestConfig = {};

  if (options !== undefined) {
    if (options.body !== undefined) {
      axiosOptions.data = options.body;
    }

    if (options.method !== undefined) {
      axiosOptions.method = options.method;
    }

    if (options.credentials !== undefined) {
      axiosOptions.withCredentials = true;
    }

    if (options.headers !== undefined) {
      axiosOptions.headers = options.headers;
    }
  }

  return axios({
    url,
    ...axiosOptions
  })
};
