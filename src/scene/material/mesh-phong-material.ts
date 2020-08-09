import { GL } from '../../gl/gl-base';
import { Material } from './material';
import vertexShaderSource from './shader/mesh-phong.vert';
import fragmentShaderSource from './shader/mesh-phong.frag';

export class MeshPhongMaterial extends Material {
  constructor(gl: GL) {
    super(gl, vertexShaderSource, fragmentShaderSource);
  }
}
