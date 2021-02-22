import axios from 'axios';
import * as Form from 'form-data';
import { stringify } from 'querystring';
import { FormDataOptions, RequestOptions, AxiosResponse } from './common';

/**
 * Fast create an http or https request.
 */
export const fastRequest = async <T = any>(options: RequestOptions) => {
  if (!options || !options.url) return null;

  /**
   * Generate corresponding querystring values from the `options.query`
   */
  options.url = options.url && options.query ? `${options.url}?${stringify(options.query)}` : options.url;
  const response: AxiosResponse<T> = await axios(options);
  return response;
};

/**
 * Fast create an http or https form-data request.
 */
export const fastFormData = async <T = any>(options: FormDataOptions) => {
  if (!options || !options.url || !options.formData) return null;

  /**
   * Generate form data from the `options.formData`
   */
  const form = new Form();
  const { url, formData, configs } = options;
  Object.keys(formData).forEach((key) => form.append(key, formData[key]));

  /**
   * Generate axios request
   */
  const headers = !configs || !configs.headers ? form.getHeaders() : { ...configs.headers, ...form.getHeaders() };
  const response: AxiosResponse<T> = await axios.post(url, form, !configs ? { headers } : { ...configs, headers });
  return response;
};
