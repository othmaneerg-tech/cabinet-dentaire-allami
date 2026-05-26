const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'public', 'assets', 'models', 'imac.glb');
const fileBuffer = fs.readFileSync(filePath);

let offset = 12;
let jsonChunk = null;

while (offset < fileBuffer.length) {
  const chunkLength = fileBuffer.readUInt32LE(offset);
  const chunkType = fileBuffer.readUInt32LE(offset + 4);
  
  if (chunkType === 0x4E4F534A) {
    const jsonBuffer = fileBuffer.subarray(offset + 8, offset + 8 + chunkLength);
    jsonChunk = JSON.parse(jsonBuffer.toString('utf8'));
    break;
  }
  offset += 8 + chunkLength;
}

if (jsonChunk && jsonChunk.materials) {
  const screenMat = jsonChunk.materials.find(m => m.name.toLowerCase() === 'screen');
  const screenOffMat = jsonChunk.materials.find(m => m.name.toLowerCase() === 'screenoff');
  console.log('Screen Material:', JSON.stringify(screenMat, null, 2));
  console.log('ScreenOff Material:', JSON.stringify(screenOffMat, null, 2));
}
