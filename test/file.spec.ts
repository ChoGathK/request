import * as fs from 'fs';
import { resolve } from 'path';
import { expect, test } from '@jest/globals';
import { fastDownload, fastGetBuffer, fastGetStream, fastGetString, fastStreamToBuffer, fastBufferToStream } from '../src';

const basePath = resolve(__dirname, './temp');
const logo = 'https://www.gravatar.com/avatar/d47d0397605e4b9cab9fd8fce027e3b5?s=328&d=identicon&r=PG';

test('fastDownload', async () => {
  const path_null = await fastDownload(null, null);
  expect(path_null === null).toBe(true);

  const path = await fastDownload(logo, basePath + '/logo_download.png', { timeout: 60000 });
  expect(fs.existsSync(path)).toBe(true);
});

test('fastGetBuffer', async () => {
  const buffer_null = await fastGetBuffer(null);
  expect(buffer_null === null).toBe(true);

  const buffer = await fastGetBuffer(logo, { timeout: 60000 });
  fs.writeFileSync(basePath + '/logo_buffer1.png', buffer, 'binary');
  expect(fs.existsSync(basePath + '/logo_buffer1.png')).toBe(true);

  const stream = await fastBufferToStream(buffer);
  const buffer2 = await fastStreamToBuffer(stream);
  fs.writeFileSync(basePath + '/logo_buffer2.png', buffer2, 'binary');
  expect(fs.existsSync(basePath + '/logo_buffer2.png')).toBe(true);
});

test('fastGetStream', async () => {
  const stream_null = await fastGetStream(null);
  expect(stream_null === null).toBe(true);

  const stream = await fastGetStream(logo, { timeout: 60000 });
  const buffer = await fastStreamToBuffer(stream);

  fs.writeFileSync(basePath + '/logo_stream.png', buffer, 'binary');
  expect(fs.existsSync(basePath + '/logo_stream.png')).toBe(true);
});

test('fastGetString', async () => {
  const str_null = await fastGetString(null);
  expect(str_null === null).toBe(true);

  const str_null2 = await fastGetString(null);
  expect(str_null2 === null).toBe(true);

  const str1 = await fastGetString(logo, 'ascii', { timeout: 60000 });
  expect(typeof str1 === 'string').toBe(true);
});
