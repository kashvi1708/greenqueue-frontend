import * as THREE from "three";
import { fbm3 } from "./noise";

export interface RockMaterialOptions {
  /** 0 = pure rock (debris chunks), 1 = full grass cap (main island) */
  grassAmount: number;
  /** Overall craggy displacement strength */
  roughness: number;
  /** Random seed offset so instances don't look identical */
  seed: number;
}

const GRASS_TOP = new THREE.Color("#5C7A3E");
const GRASS_TOP_LIGHT = new THREE.Color("#7A9450");
const ROCK_MID = new THREE.Color("#6B6459");
const ROCK_DARK = new THREE.Color("#3A3630");
const SOIL_BAND = new THREE.Color("#4A4030");

/**
 * Builds a floating island / debris-rock mesh geometry: a noise-displaced
 * icosahedron, flattened toward a "landmass" silhouette (craggier
 * underside, gentler grass-capped top), with per-vertex colors baked in
 * so a plain MeshStandardMaterial({vertexColors:true}) reads as real
 * terrain under physically-based lighting — no external texture files.
 */
export function buildRockGeometry(
  radius: number,
  detail: number,
  opts: RockMaterialOptions
): THREE.BufferGeometry {
  const geo = new THREE.IcosahedronGeometry(radius, detail);
  const posAttr = geo.attributes.position;
  const colors = new Float32Array(posAttr.count * 3);
  const { grassAmount, roughness, seed } = opts;

  for (let i = 0; i < posAttr.count; i++) {
    const x = posAttr.getX(i);
    const y = posAttr.getY(i);
    const z = posAttr.getZ(i);
    const len = Math.sqrt(x * x + y * y + z * z) || 1;
    const nx = x / len;
    const ny = y / len;
    const nz = z / len;

    // Large-scale shape: flatten the top (grass plateau), let the
    // underside hang craggier (floating-island silhouette) — bias by ny.
    const undersideBias = ny < 0 ? 1.6 : 0.9;
    const largeNoise = fbm3(nx * 1.4 + seed, ny * 1.4 + seed, nz * 1.4 + seed, 3);
    const fineNoise = fbm3(nx * 4 + seed * 3, ny * 4 + seed * 3, nz * 4 + seed * 3, 3);
    const displacement =
      (largeNoise * 0.6 + fineNoise * 0.25) * roughness * undersideBias;

    // Flatten the very top slightly so grass reads as a plateau, not a peak.
    const topFlatten = ny > 0.55 ? (ny - 0.55) * 0.35 : 0;

    const newLen = radius + displacement * radius - topFlatten * radius;
    posAttr.setXYZ(i, nx * newLen, ny * newLen, nz * newLen);

    // Vertex color: grass on top, rock below, soft soil transition band.
    const heightFactor = ny; // -1 (bottom) .. 1 (top)
    const colorNoise = fbm3(nx * 6 + seed * 7, ny * 6 + seed * 7, nz * 6 + seed * 7, 2);
    const color = new THREE.Color();

    if (grassAmount > 0.01 && heightFactor > 0.15) {
      const t = Math.min(1, (heightFactor - 0.15) / 0.35);
      color.copy(GRASS_TOP).lerp(GRASS_TOP_LIGHT, Math.max(0, colorNoise) * 0.5);
      if (t < 1) {
        // blend down into the soil band just below the grass line
        color.lerp(SOIL_BAND, 1 - t);
      }
      // fade grass presence for debris rocks (grassAmount partial)
      if (grassAmount < 1) {
        const rockColor = ROCK_MID.clone().lerp(ROCK_DARK, Math.max(0, -colorNoise));
        color.lerp(rockColor, 1 - grassAmount);
      }
    } else if (grassAmount > 0.01 && heightFactor > -0.1) {
      // soil transition band just under the grass line
      const t = (heightFactor + 0.1) / 0.25;
      color.copy(SOIL_BAND).lerp(ROCK_MID, 1 - Math.max(0, Math.min(1, t)));
    } else {
      color.copy(ROCK_MID).lerp(ROCK_DARK, Math.max(0, -colorNoise) * 0.7 + Math.max(0, -heightFactor) * 0.3);
    }

    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geo.computeVertexNormals();
  return geo;
}
