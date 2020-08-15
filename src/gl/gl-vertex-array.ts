import { GL, GlBase } from './gl-base';

enum DrawIndex {
  ARRAYS,
  ELEMENTS,
}

export enum DrawMode {
  LINES,
  TRIANGLES,
  TRIANGLE_STRIP,
}

export class GlVertexArray extends GlBase {
  readonly vertexArray: WebGLVertexArrayObject;

  private drawIndex: DrawIndex = DrawIndex.ARRAYS;
  private drawMode: number;
  private first: number = 0;
  private count: number = 0;

  constructor(gl: GL) {
    super(gl);

    this.vertexArray = gl.createVertexArray();
  }

  dispose() {
    this.gl.deleteVertexArray(this.vertexArray);
  }

  bind() {
    this.gl.bindVertexArray(this.vertexArray);
  }

  unbind() {
    this.gl.bindVertexArray(null);
  }

  setDrawArrayMode(mode: DrawMode, count: number, first?: number) {
    this.drawIndex = DrawIndex.ARRAYS;
    this.drawMode = this.drawModeToGlEnum(mode);
    this.count = count;
    this.first = first || 0;
  }

  setDrawElementMode(mode: DrawMode, count: number, first?: number) {
    this.drawIndex = DrawIndex.ELEMENTS;
    this.drawMode = this.drawModeToGlEnum(mode);
    this.count = count;
    this.first = first || 0;
  }

  draw() {
    const gl = this.gl;

    switch (this.drawIndex) {
    case DrawIndex.ARRAYS:
      gl.drawArrays(this.drawMode, this.first, this.count);
      break;
    case DrawIndex.ELEMENTS:
      gl.drawElements(this.drawMode, this.count, this.gl.UNSIGNED_INT, this.first);
      break;
    default:
      console.error('unknown draw index mode');
    }
  }

  private drawModeToGlEnum(mode: DrawMode) {
    switch (mode) {
    case DrawMode.LINES: return this.gl.LINES;
    case DrawMode.TRIANGLES: return this.gl.TRIANGLES;
    case DrawMode.TRIANGLE_STRIP: return this.gl.TRIANGLE_STRIP;
    default: console.error('unknown draw mode');
    }
  }
}
