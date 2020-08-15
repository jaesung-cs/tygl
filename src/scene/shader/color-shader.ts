import { GL } from '../../gl/gl-base';
import { Shader } from './shader';
import vertexShaderSource from './source/color.vert';
import fragmentShaderSource from './source/color.frag';

export class MeshColorShader extends Shader {
  constructor(gl: GL) {
    super(gl, vertexShaderSource, fragmentShaderSource);
  }
}
