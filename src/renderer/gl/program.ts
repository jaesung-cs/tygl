import { GL, GlBase } from './gl-base';
import {
  VertexShader,
  FragmentShader,
} from '.';

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

  attribLocation(name: string): number {
    return this.gl.getAttribLocation(this.program, name);
  }
}
