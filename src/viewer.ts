import { Scene, Camera } from './scene';
import { Model, SphereModel, AxisModel, GridModel, SurfaceModel, GroundModel, ScreenModel } from './scene/model';
import { MeshColorShader, SurfaceShader, ReflectiveGroundStencilShader, ReflectiveGroundRenderShader, BlurShader } from './scene/shader';
import { Affine3, Vector3 } from './math';
import { CameraControls } from './renderer/camera-controls';
import { GlFramebuffer } from './gl';
import { RenderTarget } from './scene/render-target';

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
  private reflectiveGroundRenderShader: ReflectiveGroundRenderShader;
  
  private reflectionRenderTarget: RenderTarget;
  private blurRenderTarget: RenderTarget;
  private screenBlurShader: BlurShader;
  private screenModel: ScreenModel;

  //The time (milliseconds) when `renderingLoop()` was last called.
  private prevTime: number | undefined;

  constructor(element: HTMLElement) {
    this.element = element;

    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('webgl2', {
      stencil: true,
      antialias: false,
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
    this.surfaceShader = new SurfaceShader(gl);
    this.reflectiveGroundStencilShader = new ReflectiveGroundStencilShader(gl);
    this.reflectiveGroundRenderShader = new ReflectiveGroundRenderShader(gl);
    this.screenBlurShader = new BlurShader(gl);

    this.sphereModel = new SphereModel(gl);

    this.axisModel = new AxisModel(gl);
    this.gridModel = new GridModel(gl);

    this.surfaceModel = new SurfaceModel(gl);

    this.reflectiveGroundModel = new GroundModel(gl);

    this.cameraControls = new CameraControls(this.camera, this.element);

    this.reflectiveGroundModelTransform.scale(new Vector3(100, 100, 100));

    this.reflectionRenderTarget = new RenderTarget(gl, ...this.getSize());
    this.blurRenderTarget = new RenderTarget(gl, ...this.getSize());

    this.screenModel = new ScreenModel(gl);
    
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

    // Ground stencil draw on a texture
    this.reflectionRenderTarget.use();
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
    gl.colorMask(false, false, false, false);
    gl.depthMask(false);
    gl.stencilFunc(gl.ALWAYS, 1, 0xFF);
    gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE);
    this.reflectiveGroundStencilShader.use();
    this.reflectiveGroundStencilShader.updateCameraUniforms(this.camera);
    this.reflectiveGroundStencilShader.updateModelMatrix(this.reflectiveGroundModelTransform);
    this.reflectiveGroundModel.draw();

    // Reflected object draw on the texture
    gl.colorMask(true, true, true, true);
    gl.depthMask(true);
    gl.stencilFunc(gl.EQUAL, 1, 0xFF);
    gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
    this.surfaceShader.use();
    this.surfaceShader.updateCameraUniforms(this.camera);
    this.reflectedSurfaceModelTransform.copy(this.surfaceModelTransform).reflectZ();
    this.surfaceShader.updateModelMatrix(this.reflectedSurfaceModelTransform);
    this.surfaceModel.draw();
    this.reflectionRenderTarget.done();

    // Horizontal blur on the texture
    this.blurRenderTarget.use();
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
    gl.stencilFunc(gl.ALWAYS, 0, 0xFF);
    this.reflectionRenderTarget.bindActiveTexture(0);
    gl.disable(gl.DEPTH_TEST);
    this.screenBlurShader.use();
    this.screenBlurShader.setDistance(0.002);
    this.screenBlurShader.setHorizontal();
    this.screenModel.draw();
    this.blurRenderTarget.done();

    // Vertical blur on the texture
    this.blurRenderTarget.bindActiveTexture(0);
    this.screenBlurShader.use();
    this.screenBlurShader.setVertical();
    this.screenModel.draw();

    // Copy color texture to the screen
    //this.blurRenderTarget.blitToScreen(...this.getSize());

    // Grid draw
    gl.enable(gl.DEPTH_TEST);
    gl.stencilFunc(gl.ALWAYS, 0, 0xFF);
    gl.depthFunc(gl.ALWAYS);
    this.meshColorShader.use();
    this.meshColorShader.updateCameraUniforms(this.camera);
    this.meshColorShader.updateModelMatrix(this.identityTransform);
    /*
    this.gridModel.draw();
    this.axisModel.draw();
    */
    gl.depthFunc(gl.LESS);

    // Blur reflected objects on the texture

    // Object draw
    this.surfaceShader.use();
    this.surfaceShader.updateCameraUniforms(this.camera);
    this.surfaceShader.updateModelMatrix(this.surfaceModelTransform);
    this.surfaceModel.draw();

    // Put sphere model at camera center
    this.meshColorShader.use();
    this.meshColorShader.updateCameraUniforms(this.camera);
    this.sphereModelTransform.setIdentity();
    this.sphereModelTransform.scale(new Vector3(0.02, 0.02, 0.01));
    this.sphereModelTransform.translate(this.cameraControls.center);
    this.meshColorShader.updateModelMatrix(this.sphereModelTransform);
    this.sphereModel.draw();
    
    requestAnimationFrame(this.renderingLoop);
  }
}
