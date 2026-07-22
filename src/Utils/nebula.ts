import * as THREE from 'three';
import { createStarfield, updateStarfield } from './space';

/**
 * A swirling cosmic-void backdrop: layered nebula clouds on a giant inverted
 * sphere, a starfield, and a soft warm glow core suggesting a distant light
 * source. Palette pulled from the reference image (deep indigo/navy, violet,
 * magenta, cool blue, warm cream highlight) — this is an original shader-driven
 * scene, not a reproduction of any specific copyrighted artwork.
 */

// ---------- Nebula sphere ----------

const nebulaVertexShader = `
  varying vec3 vDir;

  void main() {
    vDir = normalize(position);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const nebulaFragmentShader = `
  varying vec3 vDir;
  uniform float uTime;

  // hash-based value noise + fbm
  float hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  float noise(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
          mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
      mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
          mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y),
      f.z
    );
  }

  float fbm(vec3 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 5; i++) {
      value += amplitude * noise(p);
      p *= 2.02;
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    vec3 p = vDir * 2.2;

    // two drifting cloud layers at different speeds for a parallax swirl
    float cloudA = fbm(p + vec3(uTime * 0.015, uTime * 0.01, 0.0));
    float cloudB = fbm(p * 1.6 - vec3(0.0, uTime * 0.012, uTime * 0.018));
    float clouds = mix(cloudA, cloudB, 0.5);

    // palette sampled from the reference: deep navy base -> indigo -> violet -> magenta
    vec3 navy    = vec3(0.02, 0.02, 0.06);
    vec3 indigo  = vec3(0.08, 0.07, 0.28);
    vec3 violet  = vec3(0.28, 0.13, 0.45);
    vec3 magenta = vec3(0.55, 0.20, 0.55);
    vec3 blue    = vec3(0.10, 0.25, 0.55);

    vec3 color = navy;
    color = mix(color, indigo, smoothstep(0.25, 0.55, clouds));
    color = mix(color, violet, smoothstep(0.45, 0.7, clouds));
    color = mix(color, magenta, smoothstep(0.62, 0.85, cloudA));
    color = mix(color, blue, smoothstep(0.5, 0.9, cloudB) * 0.5);

    // subtle vignette toward the poles for depth
    float vignette = smoothstep(1.0, -0.2, abs(vDir.y));
    color *= mix(0.6, 1.0, vignette);

    gl_FragColor = vec4(color, 1.0);
  }
`;

function createNebulaSphere(radius = 90): THREE.Mesh {
  const geometry = new THREE.SphereGeometry(radius, 48, 32);
  const material = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    vertexShader: nebulaVertexShader,
    fragmentShader: nebulaFragmentShader,
    side: THREE.BackSide,
    depthWrite: false,
  });
  return new THREE.Mesh(geometry, material);
}

function updateNebulaSphere(mesh: THREE.Mesh, time: number): void {
  (mesh.material as THREE.ShaderMaterial).uniforms['uTime'].value = time;
}

// ---------- Warm glow core (distant light source) ----------

function createGlowCore(): THREE.Sprite {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, 'rgba(255, 244, 224, 1)');
  gradient.addColorStop(0.25, 'rgba(240, 210, 220, 0.85)');
  gradient.addColorStop(0.6, 'rgba(180, 110, 200, 0.25)');
  gradient.addColorStop(1, 'rgba(180, 110, 200, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const sprite = new THREE.Sprite(material);
  sprite.scale.set(28, 28, 1);
  sprite.position.set(-14, 9, -40);
  return sprite;
}

// ---------- Drifting cosmic dust threads (recolored to match the palette) ----------

const DUST_THREAD_COLORS = [0xc98bd6, 0x7f9fe0, 0xe0a8d0, 0x9f7fd6];

export interface DustThreadsHandle {
  group: THREE.Group;
  meshes: THREE.Mesh[];
}

function createDustThreads(count = 10, spread = 26): DustThreadsHandle {
  const group = new THREE.Group();
  const meshes: THREE.Mesh[] = [];

  for (let i = 0; i < count; i++) {
    const points: THREE.Vector3[] = [];
    const segmentCount = 5 + Math.floor(Math.random() * 3);
    let cursor = new THREE.Vector3(
      (Math.random() - 0.5) * spread,
      (Math.random() - 0.5) * spread,
      (Math.random() - 0.5) * spread,
    );
    points.push(cursor.clone());
    for (let s = 0; s < segmentCount; s++) {
      cursor = cursor
        .clone()
        .add(
          new THREE.Vector3(
            (Math.random() - 0.5) * 6,
            (Math.random() - 0.5) * 6,
            (Math.random() - 0.5) * 6,
          ),
        );
      points.push(cursor);
    }

    const curve = new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.5);
    const tubeGeometry = new THREE.TubeGeometry(
      curve,
      120,
      0.012 + Math.random() * 0.018,
      8,
      false,
    );

    const color = DUST_THREAD_COLORS[Math.floor(Math.random() * DUST_THREAD_COLORS.length)];
    const material = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const mesh = new THREE.Mesh(tubeGeometry, material);
    mesh.userData['pulseSeed'] = Math.random() * Math.PI * 2;
    mesh.userData['pulseSpeed'] = 0.25 + Math.random() * 0.35;
    mesh.userData['driftAxis'] = new THREE.Vector3(
      Math.random() - 0.5,
      Math.random() - 0.5,
      Math.random() - 0.5,
    ).normalize();

    group.add(mesh);
    meshes.push(mesh);
  }

  return { group, meshes };
}

function updateDustThreads(handle: DustThreadsHandle, time: number): void {
  for (const mesh of handle.meshes) {
    const material = mesh.material as THREE.MeshBasicMaterial;
    const seed = mesh.userData['pulseSeed'] as number;
    const speed = mesh.userData['pulseSpeed'] as number;
    material.opacity = 0.2 + 0.3 * (0.5 + 0.5 * Math.sin(time * speed + seed));

    const axis = mesh.userData['driftAxis'] as THREE.Vector3;
    mesh.rotateOnAxis(axis, 0.0006);
  }
}

// ---------- Convenience: build the whole nebula backdrop at once ----------

export interface NebulaBackgroundHandle {
  group: THREE.Group;
  nebulaSphere: THREE.Mesh;
  stars: THREE.Points;
  dustThreads: DustThreadsHandle;
  glowCore: THREE.Sprite;
}

export function createNebulaBackground(scene: THREE.Scene): NebulaBackgroundHandle {
  scene.fog = new THREE.FogExp2(0x05040d, 0.012);

  const group = new THREE.Group();

  const nebulaSphere = createNebulaSphere();
  group.add(nebulaSphere);

  const stars = createStarfield(4000, 70);
  group.add(stars);

  const dustThreads = createDustThreads();
  group.add(dustThreads.group);

  const glowCore = createGlowCore();
  group.add(glowCore);

  scene.add(group);

  return { group, nebulaSphere, stars, dustThreads, glowCore };
}

export function updateNebulaBackground(handle: NebulaBackgroundHandle, time: number): void {
  updateNebulaSphere(handle.nebulaSphere, time);
  updateStarfield(handle.stars, time);
  updateDustThreads(handle.dustThreads, time);
  // whole backdrop drifts extremely slowly for a sense of vast, ambient motion
  handle.group.rotation.y = time * 0.004;
}
