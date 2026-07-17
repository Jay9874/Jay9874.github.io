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
  public readonly shadowPathD =
    'M 16.36 -196.94 L 6.69 -199.52 L -4.27 -200.00 L -16.69 -198.55 L -29.75 -194.36 ' +
    'L -47.16 -184.04 L -62.15 -168.72 L -68.92 -159.05 L -78.44 -134.54 L -79.24 -122.77 ' +
    'L -78.11 -121.64 L -77.95 -103.26 L -73.92 -86.17 L -72.31 -83.92 L -67.80 -82.95 ' +
    'L -61.51 -77.95 L -52.32 -79.08 L -48.93 -78.11 L -47.80 -59.41 L -49.09 -47.64 ' +
    'L -52.48 -43.13 L -65.70 -43.13 L -69.41 -36.52 L -77.79 -29.91 L -114.07 -14.91 ' +
    'L -118.42 -10.72 L -121.32 -4.59 L -121.97 1.69 L -126.00 11.85 L -126.00 16.69 ' +
    'L -128.74 24.75 L -131.16 24.91 L -135.51 21.68 L -135.51 60.38 L -132.77 62.64 ' +
    'L -132.12 79.08 L -123.90 87.30 L -122.29 100.36 L -122.13 145.83 L -118.90 160.50 ' +
    'L -118.42 172.43 L -116.65 173.88 L -110.04 200.00 L 68.76 200.00 L 62.64 177.43 ' +
    'L 59.90 172.11 L 59.57 165.66 L 62.64 165.98 L 72.95 174.20 L 87.79 182.10 ' +
    'L 87.95 184.04 L 92.14 184.68 L 108.42 194.68 L 113.10 195.81 L 120.68 194.36 ' +
    'L 124.22 192.10 L 132.12 184.20 L 133.09 180.98 L 135.51 178.72 L 135.19 157.28 ' +
    'L 126.80 123.10 L 126.80 119.06 L 129.87 115.84 L 129.87 112.45 L 127.93 108.59 ' +
    'L 128.42 96.17 L 125.51 91.50 L 125.03 85.69 L 120.84 75.86 L 117.94 58.44 ' +
    'L 113.58 45.87 L 113.91 37.65 L 109.39 34.58 L 108.42 30.71 L 105.04 26.04 ' +
    'L 105.04 23.30 L 102.78 20.40 L 98.59 6.53 L 96.33 3.14 L 86.50 -5.24 ' +
    'L 67.63 -14.91 L 46.51 -18.30 L 42.64 -20.56 L 33.94 -22.65 L 30.71 -26.04 ' +
    'L 29.10 -34.26 L 23.62 -40.55 L 12.01 -40.55 L 8.30 -41.68 L 8.95 -56.19 ' +
    'L 12.82 -79.56 L 16.69 -84.72 L 28.94 -86.82 L 34.91 -92.14 L 43.13 -96.98 ' +
    'L 45.87 -103.43 L 47.96 -120.84 L 50.06 -126.00 L 52.96 -144.86 L 52.16 -159.05 ' +
    'L 42.48 -177.59 L 31.04 -188.88 Z';

  // the path's own local bounding box (from the normalization step)
  private readonly pathWidth = 271.02;
  private readonly pathHeight = 400;

  // how tall the silhouette should appear on screen BEFORE any scrolling happens
  private readonly initialHeightPx = 280;

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

    const cx = this.vw / 2;
    const cy = this.vh / 2;
    this.shadowGroupRef.nativeElement.setAttribute(
      'transform',
      `translate(${cx}, ${cy}) scale(${scale})`
    );
  }
}
