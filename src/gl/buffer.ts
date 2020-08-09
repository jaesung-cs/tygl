import { GL, GlBase } from './gl-base';

export abstract class Buffer extends GlBase {
  readonly buffer: WebGLBuffer;
  readonly target: number;

  private size: number;

  constructor(gl: GL, target: number) {
    super(gl);

    this.target = target;
    this.buffer = gl.createBuffer();
    this.size = 0;
  }

  dispose() {
    this.gl.deleteBuffer(this.buffer);
  }

  bind() {
    this.gl.bindBuffer(this.target, this.buffer);
  }

  unbind() {
    this.gl.bindBuffer(this.target, null);
  }

  // Assumption: this buffer is bound
  bufferData(data: Float32Array | Int32Array | Uint32Array) {
    if (this.size < data.byteLength) {
      this.gl.bufferData(this.target, data, this.gl.STATIC_DRAW);
      this.size = data.byteLength;
    } else {
      this.gl.bufferSubData(this.target, 0, data);
    }
  }
}

export class VertexArrayBuffer extends Buffer {
  constructor(gl: GL) {
    super(gl, gl.ARRAY_BUFFER);
  }
}

export class ElementBuffer extends Buffer {
  constructor(gl: GL) {
    super(gl, gl.ELEMENT_ARRAY_BUFFER);
  }
}