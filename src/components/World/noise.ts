// Lightweight deterministic 3D value noise (not a full Perlin/Simplex
// implementation, but sufficient for terrain displacement) — avoids
// pulling in a whole noise library for one use case.

function hash3(x: number, y: number, z: number): number {
  let h = x * 374761393 + y * 668265263 + z * 2147483647;
  h = (h ^ (h >> 13)) * 1274126177;
  h = h ^ (h >> 16);
  return ((h % 2147483647) / 2147483647 + 1) % 1;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function fade(t: number) {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

export function valueNoise3(x: number, y: number, z: number): number {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const zi = Math.floor(z);
  const xf = fade(x - xi);
  const yf = fade(y - yi);
  const zf = fade(z - zi);

  const c000 = hash3(xi, yi, zi);
  const c100 = hash3(xi + 1, yi, zi);
  const c010 = hash3(xi, yi + 1, zi);
  const c110 = hash3(xi + 1, yi + 1, zi);
  const c001 = hash3(xi, yi, zi + 1);
  const c101 = hash3(xi + 1, yi, zi + 1);
  const c011 = hash3(xi, yi + 1, zi + 1);
  const c111 = hash3(xi + 1, yi + 1, zi + 1);

  const x00 = lerp(c000, c100, xf);
  const x10 = lerp(c010, c110, xf);
  const x01 = lerp(c001, c101, xf);
  const x11 = lerp(c011, c111, xf);

  const y0 = lerp(x00, x10, yf);
  const y1 = lerp(x01, x11, yf);

  return lerp(y0, y1, zf) * 2 - 1; // -1..1
}

/** Fractal Brownian motion — layered octaves of the noise above for
 * natural-looking multi-scale roughness (big bumps + fine cragginess). */
export function fbm3(x: number, y: number, z: number, octaves = 4): number {
  let amplitude = 1;
  let frequency = 1;
  let sum = 0;
  let max = 0;
  for (let i = 0; i < octaves; i++) {
    sum += valueNoise3(x * frequency, y * frequency, z * frequency) * amplitude;
    max += amplitude;
    amplitude *= 0.5;
    frequency *= 2.1;
  }
  return sum / max;
}
