import axios, {AxiosRequestConfig} from "axios";
import {FetchOptions} from "../utils";
import {FetchableInterface} from "../jsonapi-manager";

export default class FetchAxios implements FetchableInterface {
  fetch(url: string, options?: FetchOptions) {
    let axiosOptions: AxiosRequestConfig = {
      method: 'get'
    };

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

    if (axiosOptions.method.toLowerCase() === 'get') {
      return axios.get(url, {
        ...axiosOptions
      });
    }

    return axios(url, {
      ...axiosOptions
    });
  }
}
