import {
  VertexArrayBuffer,
  ElementBuffer,
  VertexArray,
  DrawMode,
  VertexShader,
  FragmentShader,
  Program,
} from './gl';
import { Scene, Camera } from './scene';
import { Model } from './scene/model';
import { MeshColorMaterial } from './scene/material';
import { Affine3 } from './math';
import { CameraControls } from './renderer/camera-controls';

export class Viewer {
  private element: HTMLElement;
  private canvas: HTMLCanvasElement;
  private context: WebGL2RenderingContext;

  private model: Model;

  private scene: Scene;

  private camera: Camera = new Camera();
  private cameraControls: CameraControls;

  private meshColorMaterial: MeshColorMaterial;
  private modelTransform: Affine3 = new Affine3();
  
  //The time (milliseconds) when `renderingLoop()` was last called.
  private prevTime: number | undefined;

  constructor(element: HTMLElement) {
    this.element = element;

    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('webgl2');
    const gl = this.context;

    element.appendChild(this.canvas);

    console.log(`Version: ${gl.getParameter(gl.VERSION)}`);

    window.addEventListener('resize', () => { this.resize(); });

    this.initialize();

    this.startRenderingLoop();
  }

  //
  // Callback functions
  // 
  resize() {
    const [width, height] = [this.element.clientWidth, this.element.clientHeight];

    this.canvas.width = width;
    this.canvas.height = height;

    this.context.viewport(0, 0, width, height);
  }

  //
  // gl resources
  //
  initialize(): void {
    const gl = this.context;

    this.resize();

    this.meshColorMaterial = new MeshColorMaterial(gl);

    this.model = new Model(gl);

    this.model.beginModel({
      hasPosition: true,
      hasNormal: true,
    }, DrawMode.TRIANGLE_STRIP, true);
    
    this.model.addVertex(
      {position: [-1, -1, 0],  normal: [1, 0, 0]},
      {position: [1, -1, 0], normal: [0, 1, 0]},
      {position: [-1, 1, 1], normal: [0, 0, 1]},
      {position: [1, 1, 1],  normal: [1, 1, 0]},
    );
    this.model.addElementIndex(0, 1, 2, 3);
    this.model.endModel();

    this.cameraControls = new CameraControls(this.camera, this.element);

    gl.clearColor(1, 1, 1, 1);
  }

  //
  // rendering
  //
  startRenderingLoop(): void {
    requestAnimationFrame(this.renderingLoop);
  }

  private renderingLoop = (time: number) => {
    const dt = this.prevTime === undefined ? 0. : time - this.prevTime;
    this.prevTime = time;

    const scope = this;
    const gl = this.context;

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Camera update
    const aspect = this.canvas.width / this.canvas.height;
    this.camera.left = -aspect;
    this.camera.right = aspect;
    this.camera.aspect = aspect;

    this.cameraControls.update(dt);

    this.meshColorMaterial.updateCameraUniforms(this.camera);
    this.meshColorMaterial.updateModelMatrix(this.modelTransform);

    this.meshColorMaterial.use();
    this.model.draw();
    
    requestAnimationFrame(this.renderingLoop);
  }
}
