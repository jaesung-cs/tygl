import {
  DrawMode,
} from './gl';
import { Scene, Camera } from './scene';
import { Model, SphereModel, AxisModel, GridModel, SurfaceModel } from './scene/model';
import { MeshColorMaterial, SurfaceMaterial } from './scene/material';
import { Affine3, Vector3 } from './math';
import { CameraControls } from './renderer/camera-controls';

export class Viewer {
  private element: HTMLElement;
  private canvas: HTMLCanvasElement;
  private context: WebGL2RenderingContext;

  private surfaceModel: SurfaceModel;
  private surfaceModelTransform: Affine3 = new Affine3();

  private sphereModel: Model;
  private sphereModelTransform: Affine3 = new Affine3();

  private identityTransform: Affine3 = new Affine3();
  private axisModel: AxisModel;
  private gridModel: GridModel;

  private scene: Scene;

  private camera: Camera = new Camera();
  private cameraControls: CameraControls;

  private surfaceMaterial: SurfaceMaterial;
  private meshColorMaterial: MeshColorMaterial;
  
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
    this.surfaceMaterial = new SurfaceMaterial(gl);

    this.sphereModel = new SphereModel(gl);

    this.axisModel = new AxisModel(gl);
    this.gridModel = new GridModel(gl);

    this.surfaceModel = new SurfaceModel(gl);

    this.cameraControls = new CameraControls(this.camera, this.element);

    gl.clearColor(1, 1, 1, 1);
    gl.enable(gl.DEPTH_TEST);
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

    const gl = this.context;

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Camera update
    const aspect = this.canvas.width / this.canvas.height;
    this.camera.left = -aspect;
    this.camera.right = aspect;
    this.camera.aspect = aspect;

    this.cameraControls.update(dt);

    this.meshColorMaterial.use();
    this.meshColorMaterial.updateCameraUniforms(this.camera);
    this.meshColorMaterial.updateModelMatrix(this.identityTransform);

    // grid draw
    gl.depthFunc(gl.ALWAYS);
    this.gridModel.draw();
    this.axisModel.draw();
    gl.depthFunc(gl.LESS);

    this.surfaceMaterial.use();
    this.surfaceMaterial.updateCameraUniforms(this.camera);
    this.surfaceMaterial.updateModelMatrix(this.surfaceModelTransform);
    this.surfaceModel.draw();

    // Put sphere model at camera center
    this.meshColorMaterial.use();

    this.sphereModelTransform.setIdentity();
    this.sphereModelTransform.scale(new Vector3(0.02, 0.02, 0.01));
    this.sphereModelTransform.translate(this.cameraControls.center);
    this.meshColorMaterial.updateModelMatrix(this.sphereModelTransform);

    this.sphereModel.draw();
    
    requestAnimationFrame(this.renderingLoop);
  }
}
