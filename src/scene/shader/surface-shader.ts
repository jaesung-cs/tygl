import { GL } from '../../gl/gl-base';
import { Shader } from './shader';
import vertexShaderSource from './source/surface.vert';
import fragmentShaderSource from './source/surface.frag';

export class SurfaceShader extends Shader {
  constructor(gl: GL) {
    super(gl, vertexShaderSource, fragmentShaderSource);
  }
}
