import * as fs from 'fs';
import * as Koa from 'koa';
import * as koaBody from 'koa-body';
import * as Router from 'koa-router';
import { resolve } from 'path';
import { expect, test } from '@jest/globals';
import { fastRequest, fastFormData } from '../src';

/**
 * test koa http server
 */
const getServer = (port: number) => {
  const app = new Koa();
  const router = new Router();
  router.get('/get', (ctx) => { ctx.body = { data: 'get', query: ctx.query } });
  router.post('/post', async (ctx) => { ctx.body = ctx.req.body });
  router.put('/put', async (ctx) => { ctx.body = ctx.req.body });
  router.delete('/delete', async (ctx) => { ctx.body = ctx.req.body });
  router.options('/options', async (ctx) => { ctx.body = { data: 'options' } });
  router.post('/form', async (ctx) => {
    expect(!!ctx.req.files.file).toBe(true);
    if (ctx.headers['x-test']) expect(ctx.headers['x-test'] === 'x-test').toBe(true);
    ctx.body = { data: ctx.req.body, files: ctx.req.files };
  });
  app.proxy = true;
  app.use(koaBody({
    formidable: { maxFileSize: 50 * 1024 * 1024 },
    patchNode: true,
    patchKoa: false,
    multipart: true,
    parsedMethods: ['POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  }));
  app.use(router.routes());
  app.use(router.allowedMethods());
  const server = app.listen(port);
  return server;
};

test('fastRequest', async () => {
  const port = 3000;
  const server = getServer(port);
  const url = 'http://localhost:' + port;

  try {
    const response = await fastRequest(null);
    expect(response === null).toBe(true);
  } catch (error) {
    console.error(error);
  }

  try {
    const response = await fastRequest({ url: url + '/get', method: 'GET', query: { a: 1 }});
    expect(response.status === 200).toBe(true);
    expect(response.data.data === 'get').toBe(true);
    expect(response.data.query.a === '1').toBe(true);
  } catch (error) {
    console.error(error);
  }

  try {
    const response = await fastRequest({ url: url + '/post', method: 'POST', data: { a: 1 }});
    expect(response.status === 200).toBe(true);
    expect(response.data.a === 1).toBe(true);
  } catch (error) {
    console.error(error);
  }

  try {
    const response = await fastRequest({ url: url + '/put', method: 'PUT', data: { a: 1 }});
    expect(response.status === 200).toBe(true);
    expect(response.data.a === 1).toBe(true);
  } catch (error) {
    console.error(error);
  }

  try {
    const response = await fastRequest({ url: url + '/delete', method: 'DELETE', data: { a: 1 }});
    expect(response.status === 200).toBe(true);
    expect(response.data.a === 1).toBe(true);
  } catch (error) {
    console.error(error);
  }

  try {
    const response = await fastRequest({ url: url + '/options', method: 'OPTIONS', data: { a: 1 }});
    expect(response.status === 200).toBe(true);
    expect(response.data.data === 'options').toBe(true);
  } catch (error) {
    console.error(error);
  }

  server.close();
});

test('fastFormData', async () => {
  const port = 3001;
  const server = getServer(port);
  const url = 'http://localhost:' + port;

  try {
    const response = await fastFormData(null);
    expect(response === null).toBe(true);
  } catch (error) {
    console.error(error);
  }

  try {
    const file = fs.createReadStream(resolve(__dirname, './form.json'));
    const response = await fastFormData({ url: url + '/form', formData: { name: 'form', file }});
    expect(response.status === 200).toBe(true);
  } catch (error) {
    console.error(error);
  }

  try {
    const file = fs.createReadStream(resolve(__dirname, './form.json'));
    const response = await fastFormData({
      url: url + '/form',
      formData: { name: 'form', file },
      configs: {
        headers: { 'x-test': 'x-test' },
      },
    });
    expect(response.status === 200).toBe(true);
  } catch (error) {
    console.error(error);
  }

  server.close();
});
