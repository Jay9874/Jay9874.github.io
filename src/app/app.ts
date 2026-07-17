import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  NgZone,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import * as THREE from 'three';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
})
export class App implements AfterViewInit, OnDestroy {
  @ViewChild('pinTrack', { static: true }) pinTrackRef!: ElementRef<HTMLDivElement>;
  @ViewChild('shadowGroup', { static: true }) shadowGroupRef!: ElementRef<SVGGElement>;
  @ViewChild('threeCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  // traced from the uploaded shadow photo, normalized so its bounding box
  // is centered at (0,0): ~271 units wide, 400 units tall
  public readonly shadowPathD = 'M 76.3364 118.019 C 78.4449 117.525, 76.9569 116.092, 81.3364 115.519 C 85.7158 114.946, 84.1701 125.865, 84.3364 132.019 C 84.5028 138.173, 84.6101 143.553, 82.3364 147.019 C 80.0626 150.484, 80.5952 150.198, 77.3364 151.519 C 74.0776 152.839, 69.3147 146.841, 66.3364 149.019 C 63.3581 151.197, 65.2232 153.327, 63.3364 156.019 C 61.4495 158.711, 61.8042 158.182, 56.3364 162.019 C 50.8686 165.856, 40.4856 166.895, 32.8364 170.519 C 25.1871 174.143, 20.278 175.608, 16.8364 179.519 C 13.3948 183.43, 15.7038 179.996, 12.3364 186.519 C 8.96895 193.042, 9.76949 207.342, 8.33637 215.519 C 6.90325 223.695, 7.13154 221.592, 5.83637 228.519 C 4.5412 235.446, 2.41959 243.259, 1.83637 251.019 C 1.25315 258.779, -0.854433 262.562, 1.83637 268.019 C 4.52718 273.476, 8.86733 271.369, 12.3364 277.519 C 15.8054 283.669, 12.3364 292.001, 12.3364 299.519 L 12.3364 316.019 C 12.3364 322.853, 11.5753 326.75, 12.3364 334.519 C 13.0975 342.288, 15.3935 348.387, 16.8364 355.519 C 18.2792 362.651, 18.1261 364.737, 19.8364 371.019 C 21.5466 377.301, 24.0939 382.632, 25.8364 387.519 C 27.5789 392.406, 29.656 393.408, 28.8364 396.019 C 28.0167 398.63, 26.7605 397.76, 25.8364 400.019 C 24.9122 402.278, 24.7228 405.515, 25.8364 407.519 C 26.9499 409.523, 28.3137 409.1, 28.8364 410.519 C 29.359 411.938, 28.1675 412.092, 28.8364 414.019 C 29.5052 415.946, 31.2106 418.969, 34.8364 417.519 C 37.3364 416.519, 34.8364 426.519, 34.8364 431.019 C 34.8364 452.519, 216.04 515.378, 213.836 473.519 C 211.633 431.66, 208.105 453.094, 207.336 443.519 C 206.567 433.944, 208.578 433.732, 207.336 425.019 C 206.095 416.306, 200.404 408.523, 198.336 400.019 C 196.268 391.515, 197.258 391.74, 195.336 382.019 C 193.414 372.298, 182.336 349.519, 184.836 348.019 C 187.336 346.519, 198.417 359.105, 204.836 363.019 C 211.256 366.933, 213.88 367.99, 219.836 371.019 C 225.792 374.048, 230.833 377.999, 235.336 378.519 C 239.84 379.039, 237.804 379.056, 241.336 378.519 C 244.869 377.982, 249.736 376.082, 252.336 373.019 C 254.936 369.956, 254.901 368.384, 255.836 365.519 C 256.772 362.654, 256.785 362.221, 257.336 358.519 C 257.888 354.817, 257.739 351.206, 257.836 346.519 C 257.934 341.832, 258.511 340.593, 257.836 334.519 C 257.162 328.445, 253.793 321.908, 252.336 316.019 C 250.88 310.13, 247.635 307.377, 249.836 304.519 C 252.038 301.66, 254.1 304.309, 255.836 301.519 C 257.573 298.729, 252.747 295.14, 252.336 292.019 C 251.925 288.897, 251.254 284.946, 249.836 275.019 C 248.336 264.519, 245.663 255.704, 241.336 242.019 C 237.01 228.334, 234.465 222.417, 231.836 215.519 C 229.208 208.62, 229.887 210.235, 228.336 206.519 C 226.786 202.803, 226.611 200.24, 223.836 196.519 C 221.061 192.798, 218.133 191.386, 213.836 188.519 C 209.54 185.652, 206.35 184.136, 201.836 182.019 C 197.323 179.902, 196.175 179.326, 190.836 177.519 C 185.498 175.712, 179.495 174.952, 174.336 173.519 C 169.178 172.086, 167.071 171.967, 164.336 170.519 C 161.602 169.07, 161.303 169.688, 159.836 167.519 C 158.37 165.35, 159.704 161.818, 158.336 159.519 C 156.968 157.22, 156.998 157.286, 155.336 156.019 C 153.675 154.752, 152.939 153.45, 151.336 153.019 C 149.734 152.587, 150.277 153.019, 147.836 153.019 C 145.396 153.019, 144.098 155.409, 138.836 153.019 C 133.574 150.629, 137.844 138.233, 138.836 130.519 C 142.124 104.96, 145.038 118.865, 159.836 109.519 C 162.991 107.527, 162.234 105.427, 164.336 104.019 C 166.438 102.61, 167.864 103.114, 169.836 102.019 C 171.809 100.924, 171.852 101.492, 174.336 98.5189 C 176.821 95.5456, 178.251 89.1194, 178.836 85.0189 C 179.422 80.9184, 179.857 80.45, 180.336 77.5189 C 180.816 74.5878, 180.75 73.2406, 181.336 70.0189 C 181.923 66.7972, 181.836 62.5189, 181.336 61.0189 C 180.836 59.5189, 179.068 61.0475, 178.836 59.0189 C 178.605 56.9903, 179.907 53.9527, 180.336 51.0189 C 180.766 48.0852, 180.93 45.4859, 180.336 42.0189 C 179.743 38.5519, 178.54 36.4383, 177.336 33.5189 C 176.132 30.5996, 176.071 30.0441, 174.336 27.0189 C 172.602 23.9938, 170.684 21.5587, 167.836 18.5189 C 164.989 15.4792, 163.075 13.9547, 159.836 11.5189 C 156.598 9.08319, 155.056 7.83254, 151.336 6.01893 C 147.617 4.20533, 145.992 3.7886, 140.836 2.51893 C 135.681 1.24926, 130.551 0.357203, 124.836 0.518934 C 119.122 0.680665, 116.526 1.39411, 111.836 2.51893 C 107.147 3.64376, 105.154 4.27754, 100.836 6.01893 C 96.5189 7.76032, 93.8453 9.05493, 89.8364 11.5189 L 89.5796 11.6767 C 85.7247 14.0455, 83.3821 15.485, 80.3364 18.5189 C 77.2236 21.6196, 75.6967 23.6023, 73.3364 26.5189 C 70.9761 29.4355, 70.521 30.608, 68.3364 33.5189 C 66.1518 36.4298, 64.6896 38.5874, 62.8364 42.0189 C 60.9831 45.4505, 60.0767 47.6823, 58.8364 51.0189 C 57.596 54.3556, 57.3185 55.7007, 56.3364 59.0189 C 55.3542 62.3371, 54.0999 65.2311, 53.8364 68.0189 C 53.5729 70.8067, 53.2712 71.4365, 53.8364 73.0189 C 54.4015 74.6014, 56.2332 74.8947, 55.8364 76.0189 C 55.4396 77.1432, 56.1453 75.2719, 53.8364 77.5189 C 51.5275 79.766, 53.1989 86.7198, 53.8364 91.5189 C 54.4738 96.318, 54.9622 100.21, 55.8364 104.019 C 56.7106 107.828, 55.9418 108.554, 58.3364 111.019 C 60.7309 113.484, 63.9245 111.946, 66.3364 113.519 C 68.7482 115.092, 68.6704 117.197, 70.8364 118.019 C 73.0024 118.841, 74.2279 118.512, 76.3364 118.019 Z';

  // the path's own local bounding box (from the normalization step)
  private readonly pathWidth = 271.02;
  private readonly pathHeight = 400;

  // how tall the silhouette should appear on screen BEFORE any scrolling happens
  private readonly initialHeightPx = 560;

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private mesh!: THREE.Mesh;

  private animationId = 0;
  private vw = 0;
  private vh = 0;
  private minScale = 0;
  private maxScale = 0;
  private ticking = false;
  private scrollProgress = 0;

  constructor(private ngZone: NgZone) { }

  ngAfterViewInit(): void {
    this.initThree();
    this.resize();
    this.ngZone.runOutsideAngular(() => this.animate());
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationId);
    this.mesh?.geometry.dispose();
    (this.mesh?.material as THREE.Material)?.dispose();
    this.renderer?.dispose();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.resize();
  }

  @HostListener('window:scroll')
  onScroll(): void {
    if (!this.ticking) {
      requestAnimationFrame(() => {
        this.update();
        this.ticking = false;
      });
      this.ticking = true;
    }
  }

  private initThree(): void {
    const canvas = this.canvasRef.nativeElement;

    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    this.camera.position.z = 4;

    // swap this geometry/material for your own model (e.g. load a .glb with GLTFLoader)
    const geometry = new THREE.TorusKnotGeometry(1, 0.32, 200, 32);
    const material = new THREE.MeshStandardMaterial({
      color: 0x6b5bff,
      metalness: 0.4,
      roughness: 0.25,
    });
    this.mesh = new THREE.Mesh(geometry, material);
    this.scene.add(this.mesh);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(3, 3, 5);
    this.scene.add(keyLight);
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.4));
  }

  private animate = (): void => {
    this.animationId = requestAnimationFrame(this.animate);

    this.mesh.rotation.x += 0.004;
    this.mesh.rotation.y += 0.006;

    const s = 0.6 + this.scrollProgress * 0.6;
    this.mesh.scale.setScalar(s);

    this.renderer.render(this.scene, this.camera);
  };

  private resize(): void {
    this.vw = window.innerWidth;
    this.vh = window.innerHeight;

    // fixed starting size: scale needed so the shape's height = initialHeightPx
    this.minScale = this.initialHeightPx / this.pathHeight;

    // scale needed for the shape to fully cover the viewport (incl. corners),
    // based on the viewport diagonal vs. the shape's own diagonal reach from center
    const viewportDiagonal = Math.hypot(this.vw, this.vh);
    const pathHalfDiagonal = Math.hypot(this.pathWidth / 2, this.pathHeight / 2);
    this.maxScale = viewportDiagonal / 2 / pathHalfDiagonal;

    if (this.renderer) {
      this.renderer.setSize(this.vw, this.vh, false);
      this.camera.aspect = this.vw / this.vh;
      this.camera.updateProjectionMatrix();
    }

    this.update();
  }

  private ease(t: number): number {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  private update(): void {
    const track = this.pinTrackRef.nativeElement;
    const rect = track.getBoundingClientRect();
    const trackHeight = track.offsetHeight - this.vh;

    let progress = (0 - rect.top) / trackHeight;
    progress = Math.min(Math.max(progress, 0), 1);
    this.scrollProgress = progress;

    const eased = this.ease(progress);
    const scale = this.minScale + (this.maxScale - this.minScale) * eased;

    const cx = this.vw / 4;
    // const cy = this.vh / 8;
    const cy = this.vh / 10;
    this.shadowGroupRef.nativeElement.setAttribute(
      'transform',
      `translate(${cx}, ${cy}) scale(${scale})`
    );
  }
}
