import { GL } from '../../gl/gl-base';
import { Shader } from './shader';
import vertexShaderSource from './source/reflective-ground-render.vert';
import fragmentShaderSource from './source/reflective-ground-render.frag';

export class ReflectiveGroundRenderShader extends Shader {
  constructor(gl: GL) {
    super(gl, vertexShaderSource, fragmentShaderSource);
  }
}
