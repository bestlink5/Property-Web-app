import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

// Simple pure Node.js PNG generator using built-in zlib
function createPng(width, height, r, g, b, innerR, innerG, innerB) {
  const bytesPerPixel = 4;
  const rowSize = 1 + width * bytesPerPixel;
  const rawData = Buffer.alloc(rowSize * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter type: None

    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * bytesPerPixel;

      // Draw stylized rounded border and center house emblem
      const cx = width / 2;
      const cy = height / 2;
      const distFromCenter = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
      const isInner = distFromCenter < width * 0.35;

      if (isInner) {
        rawData[pixelOffset] = innerR;
        rawData[pixelOffset + 1] = innerG;
        rawData[pixelOffset + 2] = innerB;
        rawData[pixelOffset + 3] = 255;
      } else {
        rawData[pixelOffset] = r;
        rawData[pixelOffset + 1] = g;
        rawData[pixelOffset + 2] = b;
        rawData[pixelOffset + 3] = 255;
      }
    }
  }

  const compressed = zlib.deflateSync(rawData);

  // PNG Header
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR Chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // Bit depth
  ihdr[9] = 6; // Color type: RGBA
  ihdr[10] = 0; // Compression
  ihdr[11] = 0; // Filter
  ihdr[12] = 0; // Interlace
  const ihdrChunk = makeChunk('IHDR', ihdr);

  // IDAT Chunk
  const idatChunk = makeChunk('IDAT', compressed);

  // IEND Chunk
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function crc32(buf) {
  let crc = 0 ^ -1;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ -1) >>> 0;
}

const table = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  table[i] = c;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  const chunkData = Buffer.concat([typeBuf, data]);
  crcBuf.writeUInt32BE(crc32(chunkData), 0);
  return Buffer.concat([len, chunkData, crcBuf]);
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Brand Colors: Emerald #047857 (4, 120, 87) & Gold/White (255, 255, 255)
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), createPng(192, 192, 4, 120, 87, 255, 255, 255));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), createPng(512, 512, 4, 120, 87, 255, 255, 255));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), createPng(512, 512, 6, 78, 59, 16, 185, 129));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), createPng(180, 180, 4, 120, 87, 255, 255, 255));
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), createPng(32, 32, 4, 120, 87, 255, 255, 255));

console.log('PWA icons successfully generated in /public!');
