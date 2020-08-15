import { GL } from '../../gl/gl-base';
import { Shader } from './shader';
import vertexShaderSource from './source/mesh-phong.vert';
import fragmentShaderSource from './source/mesh-phong.frag';

export class MeshPhongShader extends Shader {
  constructor(gl: GL) {
    super(gl, vertexShaderSource, fragmentShaderSource);
  }
}
