import { GL, GlBase } from './gl-base';
import {
  VertexShader,
  FragmentShader,
} from '.';
import {
  Vector2, Vector3, Vector4,
  Matrix3, Matrix4,
} from '../math';

export class Program extends GlBase {
  private readonly program: WebGLProgram;

  constructor(gl: GL, vertexShader: VertexShader, fragmentShader: FragmentShader) {
    super(gl);

    this.program = gl.createProgram();

    gl.attachShader(this.program, vertexShader.shader);
    gl.attachShader(this.program, fragmentShader.shader);

    gl.linkProgram(this.program);

		const success = gl.getProgramParameter(this.program, gl.LINK_STATUS);

		if (!success) {
			const log = gl.getProgramInfoLog(this.program);
			this.dispose();
			throw new Error(`Failed to link shader program: ${log}`);
		}
  }

  dispose() {
    this.gl.deleteProgram(this.program);
  }

  use() {
    this.gl.useProgram(this.program);
  }

  done() {
    this.gl.useProgram(null);
  }

  //
  // Uniform
  //
  uniform1f(name: string, x: number) {
    this.gl.uniform1f(this.uniformLocation(name), x);
  }

  uniform1i(name: string, x: number) {
    this.gl.uniform1i(this.uniformLocation(name), x);
  }

  uniform2f(name: string, x: number, y: number) {
    this.gl.uniform2f(this.uniformLocation(name), x, y);
  }

  uniform2fv(name: string, v: Vector2) {
    this.gl.uniform2fv(this.uniformLocation(name), v.data);
  }

  uniform3f(name: string, x: number, y: number, z: number) {
    this.gl.uniform3f(this.uniformLocation(name), x, y, z);
  }

  uniform3fv(name: string, v: Vector3) {
    this.gl.uniform3fv(this.uniformLocation(name), v.data);
  }

  uniform4f(name: string, x: number, y: number, z: number, w: number) {
    this.gl.uniform4f(this.uniformLocation(name), x, y, z, w);
  }

  uniform4fv(name: string, v: Vector4) {
    this.gl.uniform4fv(this.uniformLocation(name), v.data);
  }

  uniformMatrix3f(name: string, m: Matrix3) {
    this.gl.uniformMatrix3fv(this.uniformLocation(name), false, m.data);
  }

  uniformMatrix4f(name: string, m: Matrix4) {
    this.gl.uniformMatrix4fv(this.uniformLocation(name), false, m.data);
  }

  private uniformLocation(name: string): WebGLUniformLocation {
    return this.gl.getUniformLocation(this.program, name);
  }
}
