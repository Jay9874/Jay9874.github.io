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
  @ViewChild('revealCircle', { static: true }) circleRef!: ElementRef<SVGCircleElement>;
  @ViewChild('threeCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private mesh!: THREE.Mesh;

  private animationId = 0;
  private vw = 0;
  private vh = 0;
  private maxRadius = 0;
  private ticking = false;
  private scrollProgress = 0;

  constructor(private ngZone: NgZone) {}

  ngAfterViewInit(): void {
    this.initThree();
    this.resize();
    // run the render loop outside Angular's zone so it doesn't trigger change detection every frame
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

    // subtle scale-in tied to scroll progress, purely optional polish
    const s = 0.6 + this.scrollProgress * 0.6;
    this.mesh.scale.setScalar(s);

    this.renderer.render(this.scene, this.camera);
  };

  private resize(): void {
    this.vw = window.innerWidth;
    this.vh = window.innerHeight;
    this.maxRadius = Math.hypot(this.vw, this.vh) / 2;

    const circle = this.circleRef.nativeElement;
    circle.setAttribute('cx', String(this.vw / 2));
    circle.setAttribute('cy', String(this.vh / 2));

    if (this.renderer) {
      this.renderer.setSize(this.vw, this.vh, false);
      this.camera.aspect = this.vw / this.vh;
      this.camera.updateProjectionMatrix();
    }

    this.update();
  }

  // easeInOutCubic — remove and use `progress` directly for a linear reveal
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

    const radius = this.ease(progress) * this.maxRadius;
    this.circleRef.nativeElement.setAttribute('r', String(radius));
  }
}
