import { GL } from '../../gl/gl-base';
import { Shader } from './shader';
import vertexShaderSource from './source/reflective-ground-stencil.vert';
import fragmentShaderSource from './source/reflective-ground-stencil.frag';

export class ReflectiveGroundStencilShader extends Shader {
  constructor(gl: GL) {
    super(gl, vertexShaderSource, fragmentShaderSource);
  }
}
