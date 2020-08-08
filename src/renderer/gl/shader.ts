import { GL, GlBase } from './gl-base';

export abstract class Shader extends GlBase {
  readonly shader_: WebGLShader;
  private source: string;
  
  get shader(): WebGLShader { return this.shader_; }

  constructor(gl: GL, type: number) {
    super(gl);

    this.shader_ = gl.createShader(type);
  }

  dispose() {
    this.gl.deleteShader(this.shader);
  }

  loadSource(source: string) {
    const gl = this.gl;

    this.source = `${source}`;
    gl.shaderSource(this.shader, this.source);

    gl.compileShader(this.shader);
    
		const success = gl.getShaderParameter(this.shader, gl.COMPILE_STATUS);

		if (!success) {
			const log = gl.getShaderInfoLog(this.shader);
			gl.deleteShader(this.shader);
			throw Error(`Failed to compile WebGL shader:\n${log}`);
		}
  }
}

export class VertexShader extends Shader {
  constructor(gl: GL, source: string) {
    super(gl, gl.VERTEX_SHADER);
    this.loadSource(source);
  }
}

export class FragmentShader extends Shader {
  constructor(gl: GL, source: string) {
    super(gl, gl.FRAGMENT_SHADER);
    this.loadSource(source);
  }
}
