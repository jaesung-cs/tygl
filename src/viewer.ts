import { Scene, Camera } from './scene';
import { Model, SphereModel, AxisModel, GridModel, SurfaceModel, GroundModel, ScreenModel } from './scene/model';
import { MeshColorShader, SurfaceShader, ReflectiveGroundStencilShader, ReflectiveGroundRenderShader, BlurShader, MeshPhongShader } from './scene/shader';
import { Affine3, Vector3 } from './math';
import { CameraControls } from './renderer/camera-controls';
import { GlFramebuffer } from './gl';
import { RenderTarget } from './scene/render-target';
import { Material } from './scene/material';
import { Light } from './scene/light';

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

  private surfaceShader: SurfaceShader;
  private meshColorShader: MeshColorShader;
  private meshPhongShader: MeshPhongShader;
  
  private reflectionRenderTarget: RenderTarget;
  private blurRenderTarget: RenderTarget;

  private surfaceMaterial: Material = new Material();
  private cameraCenterMaterial: Material = new Material();
  private light: Light = new Light();

  //The time (milliseconds) when `renderingLoop()` was last called.
  private prevTime: number | undefined;

  constructor(element: HTMLElement) {
    this.element = element;

    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('webgl2', {
      stencil: true,
    });
    const gl = this.context;

    element.appendChild(this.canvas);

    console.log(`Version: ${gl.getParameter(gl.VERSION)}`);

    window.addEventListener('resize', () => { this.resize(); });

    this.initialize();

    this.startRenderingLoop();
  }

  private getSize(): [number, number] {
    return [this.element.clientWidth, this.element.clientHeight]
  }

  //
  // Callback functions
  // 
  resize() {
    const [width, height] = this.getSize();

    this.canvas.width = width;
    this.canvas.height = height;

    this.reflectionRenderTarget.resize(width, height);
    this.blurRenderTarget.resize(width, height);

    this.context.viewport(0, 0, width, height);
  }

  //
  // gl resources
  //
  initialize(): void {
    const gl = this.context;

    this.meshColorShader = new MeshColorShader(gl);
    this.meshPhongShader = new MeshPhongShader(gl);
    this.surfaceShader = new SurfaceShader(gl);

    this.sphereModel = new SphereModel(gl);

    this.axisModel = new AxisModel(gl);
    this.gridModel = new GridModel(gl);

    this.surfaceModel = new SurfaceModel(gl);

    this.cameraControls = new CameraControls(this.camera, this.element);

    this.reflectionRenderTarget = new RenderTarget(gl, ...this.getSize());
    this.blurRenderTarget = new RenderTarget(gl, ...this.getSize());

    this.surfaceMaterial.ambient;
    
    this.cameraCenterMaterial.ambient.set(0.5, 0.5, 0.);
    this.cameraCenterMaterial.diffuse.set(0.5, 0.5, 0.);

    this.resize();

    gl.clearColor(1, 1, 1, 1);
    gl.clearDepth(1);
    gl.clearStencil(0);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.STENCIL_TEST);
    
    gl.frontFace(gl.CCW);
    gl.disable(gl.CULL_FACE);
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

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);

    // Camera update
    const aspect = this.canvas.width / this.canvas.height;
    this.camera.left = -aspect;
    this.camera.right = aspect;
    this.camera.aspect = aspect;

    this.cameraControls.update(dt);

    // Grid draw
    /*
    gl.enable(gl.DEPTH_TEST);
    gl.stencilFunc(gl.ALWAYS, 0, 0xFF);
    gl.depthFunc(gl.ALWAYS);
    this.meshColorShader.use();
    this.meshColorShader.updateCameraUniforms(this.camera);
    this.meshColorShader.updateModelMatrix(this.identityTransform);
    this.gridModel.draw();
    this.axisModel.draw();
    gl.depthFunc(gl.LESS);
    */

    // Object draw
    this.surfaceShader.use();
    this.surfaceShader.updateCameraUniforms(this.camera);
    this.surfaceShader.updateModelMatrix(this.surfaceModelTransform);
    this.surfaceShader.setNumLights(1);
    this.surfaceShader.setLight(0, this.light);
    this.surfaceShader.setMaterial(this.surfaceMaterial);
    this.surfaceModel.draw();

    // Put sphere model at camera center
    this.meshPhongShader.use();
    this.meshPhongShader.updateCameraUniforms(this.camera);
    this.sphereModelTransform.setIdentity();
    this.sphereModelTransform.scale(new Vector3(0.04, 0.04, 0.02));
    this.sphereModelTransform.translate(this.cameraControls.center);
    this.meshPhongShader.updateModelMatrix(this.sphereModelTransform);
    this.meshPhongShader.setNumLights(1);
    this.meshPhongShader.setLight(0, this.light);
    this.meshPhongShader.setMaterial(this.cameraCenterMaterial);
    this.sphereModel.draw();
    
    requestAnimationFrame(this.renderingLoop);
  }
}
