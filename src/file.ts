import * as fs from 'fs';
import axios from 'axios';
import { Stream } from 'stream';
import { AxiosResponse, AxiosRequestConfig, BufferEncoding } from './common';

/**
 * Fast download web file and transform to buffer
 */
export const fastGetBuffer = async (url: string, configs?: AxiosRequestConfig) => {
  if (!url) return null;
  const response: AxiosResponse<Buffer> = await axios({ url, responseType: 'arraybuffer', ...configs });
  return response.data;
};

/**
 * Fast download web file and transform to stream
 */
export const fastGetStream = async (url: string, configs?: AxiosRequestConfig) => {
  if (!url) return null;
  const response: AxiosResponse<Stream> = await axios({ url, responseType: 'stream', ...configs });
  return response.data;
};

/**
 * Fast download web file
 */
export const fastDownload = async (url: string, path: string, configs?: AxiosRequestConfig) => {
  if (!url || !path) return null;
  const response: AxiosResponse<Stream> = await axios({ url, responseType: 'stream', ...configs });
  await response.data.pipe(fs.createWriteStream(path));
  return path;
};

/**
 * Fast download web file and transform to string
 */
export const fastGetString = async (url: string, type: BufferEncoding = 'base64', configs?: AxiosRequestConfig): Promise<string> => {
  if (!url) return null;
  const buffer = await fastGetBuffer(url, configs);
  return buffer.toString(type);
};
