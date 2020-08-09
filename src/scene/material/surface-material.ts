import { GL } from '../../gl/gl-base';
import { Material } from './material';
import vertexShaderSource from './shader/surface.vert';
import fragmentShaderSource from './shader/surface.frag';

export class SurfaceMaterial extends Material {
  constructor(gl: GL) {
    super(gl, vertexShaderSource, fragmentShaderSource);
  }
}
