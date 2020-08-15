import { Scene, Camera } from './scene';
import { Model, SphereModel, AxisModel, GridModel, SurfaceModel, GroundModel } from './scene/model';
import { MeshColorShader, SurfaceShader, ReflectiveGroundStencilShader, ReflectiveGroundRenderShader } from './scene/shader';
import { Affine3, Vector3 } from './math';
import { CameraControls } from './renderer/camera-controls';

export class Viewer {
  private element: HTMLElement;
  private canvas: HTMLCanvasElement;
  private context: WebGL2RenderingContext;

  private surfaceModel: SurfaceModel;
  private surfaceModelTransform: Affine3 = new Affine3();
  private reflectedSurfaceModelTransform: Affine3 = new Affine3();

  private sphereModel: Model;
  private sphereModelTransform: Affine3 = new Affine3();

  private reflectiveGroundModel: GroundModel;
  private reflectiveGroundModelTransform: Affine3 = new Affine3();

  private identityTransform: Affine3 = new Affine3();
  private axisModel: AxisModel;
  private gridModel: GridModel;

  private scene: Scene;

  private camera: Camera = new Camera();
  private cameraControls: CameraControls;

  private surfaceShader: SurfaceShader;
  private meshColorShader: MeshColorShader;
  private reflectiveGroundStencilShader: ReflectiveGroundStencilShader;
  
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

    this.meshColorShader = new MeshColorShader(gl);
    this.surfaceShader = new SurfaceShader(gl);

    this.sphereModel = new SphereModel(gl);

    this.axisModel = new AxisModel(gl);
    this.gridModel = new GridModel(gl);

    this.surfaceModel = new SurfaceModel(gl);

    this.reflectiveGroundModel = new GroundModel(gl);

    this.cameraControls = new CameraControls(this.camera, this.element);

    this.reflectiveGroundStencilShader = new ReflectiveGroundStencilShader(gl);

    this.reflectiveGroundModelTransform.scale(new Vector3(100, 100, 100));

    gl.clearColor(1, 1, 1, 1);
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
    gl.depthFunc(gl.ALWAYS);
    this.meshColorShader.use();
    this.meshColorShader.updateCameraUniforms(this.camera);
    this.meshColorShader.updateModelMatrix(this.identityTransform);
    this.gridModel.draw();
    this.axisModel.draw();
    gl.depthFunc(gl.LESS);

    // Ground stencil draw
    gl.colorMask(false, false, false, false);
    gl.depthMask(false);
    gl.stencilMask(0xFF);
    gl.stencilFunc(gl.ALWAYS, 1, 0xFF);
    gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE);
    this.reflectiveGroundStencilShader.use();
    this.reflectiveGroundStencilShader.updateCameraUniforms(this.camera);
    this.reflectiveGroundStencilShader.updateModelMatrix(this.reflectiveGroundModelTransform);
    this.reflectiveGroundModel.draw();

    // Reflected object draw
    gl.colorMask(true, true, true, true);
    gl.depthMask(true);
    gl.stencilFunc(gl.EQUAL, 1, 0xFF);
    gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
    this.surfaceShader.use();
    this.surfaceShader.updateCameraUniforms(this.camera);
    this.reflectedSurfaceModelTransform.copy(this.surfaceModelTransform).reflectZ();
    this.surfaceShader.updateModelMatrix(this.reflectedSurfaceModelTransform);
    this.surfaceModel.draw();

    // Object draw
    gl.stencilFunc(gl.ALWAYS, 0, 0xFF);
    gl.stencilMask(0x00);
    this.surfaceShader.use();
    this.surfaceShader.updateCameraUniforms(this.camera);
    this.surfaceShader.updateModelMatrix(this.surfaceModelTransform);
    this.surfaceModel.draw();

    // Put sphere model at camera center
    this.meshColorShader.use();
    this.sphereModelTransform.setIdentity();
    this.sphereModelTransform.scale(new Vector3(0.02, 0.02, 0.01));
    this.sphereModelTransform.translate(this.cameraControls.center);
    this.meshColorShader.updateModelMatrix(this.sphereModelTransform);
    this.sphereModel.draw();
    
    requestAnimationFrame(this.renderingLoop);
  }
}
