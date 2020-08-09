import {
  VertexArrayBuffer,
  ElementBuffer,
  VertexArray,
  DrawMode,
  VertexShader,
  FragmentShader,
  Program,
} from './renderer/gl';
import { Scene } from './scene';
import { Model } from './renderer/resource';

// Shader files
import vertexShaderSource from './renderer/shader/test.vert';
import fragmentShaderSource from './renderer/shader/test.frag';
import { Vector3 } from './math';

export class Viewer {
  private element: HTMLElement;
  private canvas: HTMLCanvasElement;
  private context: WebGL2RenderingContext;

  private vertexShader: VertexShader;
  private fragmentShader: FragmentShader;
  private testProgram: Program;

  private model: Model;

  private scene: Scene;

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

    this.vertexShader = new VertexShader(this.context, vertexShaderSource);
    this.fragmentShader = new FragmentShader(this.context, fragmentShaderSource);

    this.testProgram = new Program(this.context, this.vertexShader, this.fragmentShader);

    // Shaders will never be used any more after linking program
    this.vertexShader.dispose();
    this.fragmentShader.dispose();

    this.model = new Model(gl);

    this.model.beginModel({
      hasPosition: true,
      hasNormal: true,
    }, DrawMode.TRIANGLE_STRIP, true);
    
    this.model.addVertex(
      {position: [-1, -1, 0],  normal: [1, 0, 0]},
      {position: [1, -0.5, 0], normal: [0, 1, 0]},
      {position: [-0.5, 1, 0], normal: [0, 0, 1]},
      {position: [1, 0.5, 0],  normal: [1, 1, 0]},
    );
    this.model.addElementIndex(0, 1, 2, 3);
    this.model.endModel();

    gl.clearColor(1, 1, 1, 1);
  }

  //
  // rendering
  //
  startRenderingLoop(): void {
    const scope = this;
    requestAnimationFrame(() => scope.renderingLoop());
  }

  private renderingLoop(): void {
    const scope = this;
    const gl = this.context;

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    this.testProgram.use();

    this.model.draw();
    
    this.testProgram.done();

    requestAnimationFrame(() => scope.renderingLoop());
  }
}
