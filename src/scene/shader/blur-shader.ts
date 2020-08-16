import { Shader } from "./shader";
import { GL } from "../../gl/gl-base";
import vertexShaderSource from './source/blur.vert';
import fragmentShaderSource from './source/blur.frag';

export class BlurShader extends Shader {
  constructor(gl: GL) {
    super(gl, vertexShaderSource, fragmentShaderSource);
  }

  setDistance(distance: number) {
    this.program.uniform1f('uDistance', distance);
  }

  setHorizontal() {
    this.program.uniform2f('uDirection', 1, 0);
  }

  setVertical() {
    this.program.uniform2f('uDirection', 0, 1);
  }
}
