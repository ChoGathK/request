import {  AxiosRequestConfig } from 'axios';

export interface RequestOptions extends AxiosRequestConfig {
  query?: any;
}

export interface FormDataOptions {
  url: string;
  formData: any;
  configs?: AxiosRequestConfig;
}
