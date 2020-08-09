import { GL } from '../../gl/gl-base';
import { Material } from './material';
import vertexShaderSource from './shader/mesh-color.vert';
import fragmentShaderSource from './shader/mesh-color.frag';

export class MeshColorMaterial extends Material {
  constructor(gl: GL) {
    super(gl, vertexShaderSource, fragmentShaderSource);
  }
}
