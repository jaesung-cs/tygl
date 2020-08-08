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

// Shader files
import vertexShaderSource from './renderer/shader/test.vert';
import fragmentShaderSource from './renderer/shader/test.frag';

export class Viewer {
  private element: HTMLElement;
  private canvas: HTMLCanvasElement;
  private context: WebGL2RenderingContext;

  private vertexShader: VertexShader;
  private fragmentShader: FragmentShader;
  private testProgram: Program;

  private arrayBuffer: VertexArrayBuffer;
  private elementBuffer: ElementBuffer;
  private vertexArray: VertexArray;

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

    this.vertexArray = new VertexArray(this.context);
    this.arrayBuffer = new VertexArrayBuffer(this.context);
    this.elementBuffer = new ElementBuffer(this.context);
    
    this.vertexArray.bind();
    this.arrayBuffer.bind();

    let buffer = new Float32Array([
      -1, -1, 0, 1, 0, 0,
      1, -0.5, 0, 0, 1, 0,
      -0.5, 1, 0, 0, 0, 1,
      1, 0.5, 0, 1, 1, 0,
    ]);

    let elementBuffer = new Int32Array([
      0, 1, 2, 3
    ]);

    this.arrayBuffer.bufferData(buffer);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 6*4, 0);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 6*4, 3*4);

    this.elementBuffer.bind();
    this.elementBuffer.bufferData(elementBuffer);

    this.vertexArray.unbind();
    this.arrayBuffer.unbind();
    this.elementBuffer.unbind();

    this.vertexArray.setDrawElementMode(DrawMode.TRIANGLE_STRIP, 4);

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

    this.vertexArray.bind();
    this.vertexArray.draw();
    this.vertexArray.unbind();

    this.testProgram.done();

    requestAnimationFrame(() => scope.renderingLoop());
  }
}
