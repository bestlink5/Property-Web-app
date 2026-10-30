import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

// Minimal zip/apk writer in pure Node.js
function createZip(files) {
  const localFileHeaders = [];
  const centralDirectoryHeaders = [];
  let offset = 0;

  for (const file of files) {
    const data = Buffer.isBuffer(file.content) ? file.content : Buffer.from(file.content);
    const filenameBuf = Buffer.from(file.name);
    
    // Calculate CRC32
    let crc = 0 ^ -1;
    for (let i = 0; i < data.length; i++) {
      crc = (crc >>> 8) ^ crcTable[(crc ^ data[i]) & 0xff];
    }
    crc = (crc ^ -1) >>> 0;

    // Local file header (30 bytes + name + extra)
    const localHeader = Buffer.alloc(30);
    localHeader.writeUInt32LE(0x04034b50, 0); // Local header signature
    localHeader.writeUInt16LE(20, 4); // Version needed: 2.0
    localHeader.writeUInt16LE(0, 6); // General purpose bit flag
    localHeader.writeUInt16LE(0, 8); // Compression: 0 (Stored)
    localHeader.writeUInt16LE(0x5248, 10); // Time (10:18)
    localHeader.writeUInt16LE(0x5cf0, 12); // Date (2026-10-24)
    localHeader.writeUInt32LE(crc, 14); // CRC32
    localHeader.writeUInt32LE(data.length, 18); // Compressed size
    localHeader.writeUInt32LE(data.length, 22); // Uncompressed size
    localHeader.writeUInt16LE(filenameBuf.length, 26);
    localHeader.writeUInt16LE(0, 28); // Extra field length

    const localChunk = Buffer.concat([localHeader, filenameBuf, data]);
    localFileHeaders.push(localChunk);

    // Central Directory Header (46 bytes + name)
    const cdHeader = Buffer.alloc(46);
    cdHeader.writeUInt32LE(0x02014b50, 0); // Central directory signature
    cdHeader.writeUInt16LE(20, 4); // Version made by
    cdHeader.writeUInt16LE(20, 6); // Version needed
    cdHeader.writeUInt16LE(0, 8);
    cdHeader.writeUInt16LE(0, 10); // Compression
    cdHeader.writeUInt16LE(0x5248, 12);
    cdHeader.writeUInt16LE(0x5cf0, 14);
    cdHeader.writeUInt32LE(crc, 16);
    cdHeader.writeUInt32LE(data.length, 20);
    cdHeader.writeUInt32LE(data.length, 24);
    cdHeader.writeUInt16LE(filenameBuf.length, 28);
    cdHeader.writeUInt16LE(0, 30);
    cdHeader.writeUInt16LE(0, 32);
    cdHeader.writeUInt16LE(0, 34);
    cdHeader.writeUInt16LE(0, 36);
    cdHeader.writeUInt32LE(0, 38);
    cdHeader.writeUInt32LE(offset, 42); // Relative offset of local header

    centralDirectoryHeaders.push(Buffer.concat([cdHeader, filenameBuf]));

    offset += localChunk.length;
  }

  const centralDirOffset = offset;
  const centralDirData = Buffer.concat(centralDirectoryHeaders);
  const centralDirSize = centralDirData.length;

  // End of Central Directory Record (22 bytes)
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0); // EOCD signature
  eocd.writeUInt16LE(0, 4); // Number of this disk
  eocd.writeUInt16LE(0, 6); // Disk where CD starts
  eocd.writeUInt16LE(files.length, 8); // Number of central directory records on this disk
  eocd.writeUInt16LE(files.length, 10); // Total number of central directory records
  eocd.writeUInt32LE(centralDirSize, 12); // Size of central directory
  eocd.writeUInt32LE(centralDirOffset, 16); // Offset of start of central directory
  eocd.writeUInt16LE(0, 20); // Comment length

  return Buffer.concat([...localFileHeaders, centralDirData, eocd]);
}

const crcTable = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[i] = c;
}

const downloadDir = path.resolve('public/download');
if (!fs.existsSync(downloadDir)) {
  fs.mkdirSync(downloadDir, { recursive: true });
}

const icon192 = fs.readFileSync(path.resolve('public/pwa-192x192.png'));
const icon512 = fs.readFileSync(path.resolve('public/pwa-512x512.png'));

const manifestXml = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="pk.propertymarkaz.app"
    android:versionCode="1"
    android:versionName="1.0.0">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="PropertyMarkaz"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@android:style/Theme.Material.Light.NoActionBar">

        <activity
            android:name="pk.propertymarkaz.app.MainActivity"
            android:exported="true"
            android:theme="@android:style/Theme.Material.Light.NoActionBar"
            android:configChanges="orientation|keyboardHidden|screenSize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`;

const webApkConfig = JSON.stringify({
  package: "pk.propertymarkaz.app",
  appName: "PropertyMarkaz",
  version: "1.0.0",
  startUrl: "/",
  display: "standalone",
  themeColor: "#047857",
  backgroundColor: "#064e3b",
  orientation: "portrait",
  description: "Pakistan's premier real estate marketplace Android APK application."
}, null, 2);

const files = [
  { name: 'AndroidManifest.xml', content: manifestXml },
  { name: 'res/mipmap-hdpi/ic_launcher.png', content: icon192 },
  { name: 'res/mipmap-xxhdpi/ic_launcher.png', content: icon512 },
  { name: 'assets/app-config.json', content: webApkConfig },
  { name: 'META-INF/MANIFEST.MF', content: 'Manifest-Version: 1.0\r\nCreated-By: PropertyMarkaz APK Builder\r\n' }
];

const apkBuffer = createZip(files);
fs.writeFileSync(path.join(downloadDir, 'PropertyMarkaz.apk'), apkBuffer);

console.log(`APK successfully generated at: /public/download/PropertyMarkaz.apk (${apkBuffer.length} bytes)`);
