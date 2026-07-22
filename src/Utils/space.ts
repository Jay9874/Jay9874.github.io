import * as THREE from 'three';

/**
 * Original deep-space background: a twinkling starfield plus a handful of
 * slowly drifting glowing "thread" curves winding through the void.
 * Not a reproduction of any specific copyrighted scene — just a generic
 * space/timeline mood built from primitives.
 */

// ---------- Starfield ----------

const starVertexShader = `
  attribute float aTwinkleSeed;
  attribute float aSize;
  uniform float uTime;
  varying float vTwinkle;

  void main() {
    // each star twinkles on its own phase/speed so they don't pulse in sync
    vTwinkle = 0.55 + 0.45 * sin(uTime * (0.6 + aTwinkleSeed) + aTwinkleSeed * 40.0);

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const starFragmentShader = `
  varying float vTwinkle;

  void main() {
    // soft round point instead of a hard square
    vec2 uv = gl_PointCoord - 0.5;
    float dist = length(uv);
    float alpha = smoothstep(0.5, 0.0, dist);
    gl_FragColor = vec4(vec3(1.0), alpha * vTwinkle);
  }
`;

export function createStarfield(count = 6000, radius = 60): THREE.Points {
  const positions = new Float32Array(count * 3);
  const seeds = new Float32Array(count);
  const sizes = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    // distribute stars in a spherical shell around the camera/scene
    const r = radius * (0.5 + Math.random() * 0.5);
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);

    seeds[i] = Math.random();
    sizes[i] = Math.random() * 1.8 + 0.4;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('aTwinkleSeed', new THREE.BufferAttribute(seeds, 1));
  geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));

  const material = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    vertexShader: starVertexShader,
    fragmentShader: starFragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const points = new THREE.Points(geometry, material);
  points.frustumCulled = false;
  return points;
}

export function updateStarfield(points: THREE.Points, time: number): void {
  const material = points.material as THREE.ShaderMaterial;
  material.uniforms['uTime'].value = time;
}

// ---------- Glowing drifting threads ----------

export interface ThreadsHandle {
  group: THREE.Group;
  meshes: THREE.Mesh[];
}

const THREAD_COLORS = [0x7fd8ff, 0xffd27f, 0xb98bff, 0x7fffcf];

export function createGlowThreads(count = 12, spread = 22): ThreadsHandle {
  const group = new THREE.Group();
  const meshes: THREE.Mesh[] = [];

  for (let i = 0; i < count; i++) {
    const points: THREE.Vector3[] = [];
    const segmentCount = 5 + Math.floor(Math.random() * 3);
    const start = new THREE.Vector3(
      (Math.random() - 0.5) * spread,
      (Math.random() - 0.5) * spread,
      (Math.random() - 0.5) * spread
    );

    let cursor = start.clone();
    points.push(cursor.clone());
    for (let s = 0; s < segmentCount; s++) {
      cursor = cursor.clone().add(
        new THREE.Vector3(
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 6
        )
      );
      points.push(cursor);
    }

    const curve = new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.5);
    const tubeGeometry = new THREE.TubeGeometry(curve, 120, 0.015 + Math.random() * 0.02, 8, false);

    const color = THREAD_COLORS[Math.floor(Math.random() * THREAD_COLORS.length)];
    const material = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const mesh = new THREE.Mesh(tubeGeometry, material);
    // stash per-thread animation state directly on userData
    mesh.userData['pulseSeed'] = Math.random() * Math.PI * 2;
    mesh.userData['pulseSpeed'] = 0.3 + Math.random() * 0.4;
    mesh.userData['driftSpeed'] = 0.02 + Math.random() * 0.03;
    mesh.userData['driftAxis'] = new THREE.Vector3(
      Math.random() - 0.5,
      Math.random() - 0.5,
      Math.random() - 0.5
    ).normalize();

    group.add(mesh);
    meshes.push(mesh);
  }

  return { group, meshes };
}

export function updateGlowThreads(handle: ThreadsHandle, time: number): void {
  for (const mesh of handle.meshes) {
    const material = mesh.material as THREE.MeshBasicMaterial;
    const seed = mesh.userData['pulseSeed'] as number;
    const speed = mesh.userData['pulseSpeed'] as number;
    material.opacity = 0.35 + 0.35 * (0.5 + 0.5 * Math.sin(time * speed + seed));

    // gentle continuous rotation of the whole thread around a random axis, like slow drift
    const axis = mesh.userData['driftAxis'] as THREE.Vector3;
    const driftSpeed = mesh.userData['driftSpeed'] as number;
    mesh.rotateOnAxis(axis, driftSpeed * 0.01);
  }
}

// ---------- Convenience: build the whole background at once ----------

export interface SpaceBackgroundHandle {
  group: THREE.Group;
  stars: THREE.Points;
  threads: ThreadsHandle;
}

export function createSpaceBackground(scene: THREE.Scene): SpaceBackgroundHandle {
  scene.background = new THREE.Color(0x02020a);
  scene.fog = new THREE.FogExp2(0x02020a, 0.02);

  const group = new THREE.Group();

  const stars = createStarfield();
  group.add(stars);

  const threads = createGlowThreads();
  group.add(threads.group);

  scene.add(group);

  return { group, stars, threads };
}

export function updateSpaceBackground(handle: SpaceBackgroundHandle, time: number): void {
  updateStarfield(handle.stars, time);
  updateGlowThreads(handle.threads, time);
  // whole background drifts very slowly for a sense of depth/motion
  handle.group.rotation.y = time * 0.008;
}