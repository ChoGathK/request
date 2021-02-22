import { Stream, Duplex } from 'stream';

/**
 * Fast transform stream to buffer
 */
export const fastStreamToBuffer = async (stream: Stream): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const buffers = [];
    stream.on('error', reject);
    stream.on('data', (data) => buffers.push(data));
    stream.on('end', () => resolve(Buffer.concat(buffers)));
  });
};

/**
 * Fast transform buffer to stream
 */
export const fastBufferToStream = async (buffer: Buffer): Promise<Stream> => {
  const stream = new Duplex();
  stream.push(buffer);
  stream.push(null);
  return stream;
};

