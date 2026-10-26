import * as THREE from 'three';

// Cache generated canvas textures so we never regenerate them unnecessarily
const textureCache = new Map<string, THREE.CanvasTexture>();

/**
 * Creates an authentic shadow plaid flannel texture
 */
export function getPlaidTexture(): THREE.CanvasTexture {
  const key = 'plaid_flannel';
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Base charcoal
  ctx.fillStyle = '#26221f';
  ctx.fillRect(0, 0, 512, 512);

  // Plaid bands
  const bandWidth = 64;
  const colors = ['rgba(100, 78, 55, 0.65)', 'rgba(28, 26, 24, 0.85)', 'rgba(148, 115, 82, 0.5)'];

  // Vertical bands
  for (let x = 0; x < 512; x += bandWidth) {
    ctx.fillStyle = colors[(x / bandWidth) % colors.length];
    ctx.fillRect(x, 0, bandWidth / 2, 512);

    // Thin accent pinstripe
    ctx.fillStyle = 'rgba(215, 185, 145, 0.35)';
    ctx.fillRect(x + bandWidth / 4, 0, 2, 512);
  }

  // Horizontal bands
  for (let y = 0; y < 512; y += bandWidth) {
    ctx.fillStyle = colors[(y / bandWidth) % colors.length];
    ctx.fillRect(0, y, 512, bandWidth / 2);

    // Thin accent pinstripe
    ctx.fillStyle = 'rgba(215, 185, 145, 0.35)';
    ctx.fillRect(0, y + bandWidth / 4, 512, 2);
  }

  // Fabric twill noise
  const imgData = ctx.getImageData(0, 0, 512, 512);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 18;
    data[i] = Math.min(255, Math.max(0, data[i] + noise));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
  }
  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  textureCache.set(key, texture);
  return texture;
}

/**
 * Creates authentic brushed mohair striped texture
 */
export function getMohairStripeTexture(): THREE.CanvasTexture {
  const key = 'mohair_stripes';
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  const bands = [
    { color: '#2B423D', h: 90 },  // deep teal
    { color: '#D9CDB8', h: 70 },  // cream oatmeal
    { color: '#8A422D', h: 85 },  // rust orange
    { color: '#1E2825', h: 65 },  // charcoal
    { color: '#D9CDB8', h: 80 },  // cream oatmeal
    { color: '#38554E', h: 122 }, // muted sage teal
  ];

  let currentY = 0;
  for (const band of bands) {
    ctx.fillStyle = band.color;
    ctx.fillRect(0, currentY, 512, band.h);

    // Fuzzy bleed transition
    const gradient = ctx.createLinearGradient(0, currentY + band.h - 10, 0, currentY + band.h + 10);
    gradient.addColorStop(0, band.color);
    gradient.addColorStop(1, 'rgba(0,0,0,0.15)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, currentY + band.h - 10, 512, 20);

    currentY += band.h;
  }

  // Brushed fuzzy fibers noise
  const imgData = ctx.getImageData(0, 0, 512, 512);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const fiberNoise = (Math.random() - 0.5) * 32;
    data[i] = Math.min(255, Math.max(0, data[i] + fiberNoise));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + fiberNoise));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + fiberNoise));
  }
  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 1);
  textureCache.set(key, texture);
  return texture;
}

/**
 * Creates authentic denim twill texture with wash gradient
 */
export function getDenimTexture(): THREE.CanvasTexture {
  const key = 'denim_twill';
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Base vintage washed indigo/ice blue
  const baseGrad = ctx.createLinearGradient(0, 0, 0, 512);
  baseGrad.addColorStop(0, '#7A96B6');
  baseGrad.addColorStop(0.35, '#8EA8C5');
  baseGrad.addColorStop(0.7, '#A5BED8'); // faded thigh/knee wash
  baseGrad.addColorStop(1.0, '#7793B3');
  ctx.fillStyle = baseGrad;
  ctx.fillRect(0, 0, 512, 512);

  // Diagonal 3x1 twill weave lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1;
  for (let i = -512; i < 1024; i += 4) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + 512, 512);
    ctx.stroke();
  }

  // Vintage enzyme wash micro speckle
  const imgData = ctx.getImageData(0, 0, 512, 512);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const grain = (Math.random() - 0.5) * 22;
    data[i] = Math.min(255, Math.max(0, data[i] + grain));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + grain));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + grain));
  }
  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 4);
  textureCache.set(key, texture);
  return texture;
}

/**
 * Creates authentic ribbed knit texture
 */
export function getRibbedTexture(): THREE.CanvasTexture {
  const key = 'ribbed_knit';
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 128, 128);

  for (let x = 0; x < 128; x += 8) {
    ctx.fillStyle = '#b0b0b0';
    ctx.fillRect(x, 0, 4, 128);
    ctx.fillStyle = '#505050';
    ctx.fillRect(x + 4, 0, 4, 128);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(8, 2);
  textureCache.set(key, texture);
  return texture;
}

/**
 * Creates subtle fabric normal map
 */
export function getFabricBumpTexture(): THREE.CanvasTexture {
  const key = 'fabric_bump';
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 256, 256);

  const imgData = ctx.getImageData(0, 0, 256, 256);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const val = 128 + Math.floor((Math.random() - 0.5) * 40);
    data[i] = val;
    data[i + 1] = val;
    data[i + 2] = val;
  }
  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(16, 16);
  textureCache.set(key, texture);
  return texture;
}
