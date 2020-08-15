import { Vector3, Quaternion } from '.';
import { Matrix4 } from './matrix4';

export class Affine3 {
  private matrix: Matrix4 = new Matrix4();

  constructor() {
  }

  copy(affine: Affine3): Affine3 {
    this.matrix.copy(affine.matrix);
    return this;
  }

  toMatrix(m: Matrix4) {
    for (let i = 0; i < 16; i++) {
      m.data[i] = this.matrix.data[i];
    }
  }

  setIdentity(): Affine3 {
    this.matrix.setIdentity();
    return this;
  }

  // Multiply translation matrix on the left
  // [I 0; x 1] * m[R 0; t 1] = [R 0; x+t 1]
  translate(v: Vector3): Affine3 {
    this.matrix.data[12] += v.x;
    this.matrix.data[13] += v.y;
    this.matrix.data[14] += v.z;
    return this;
  }

  // Multiply translation matrix on the right
  // m[R 0; t 1] * [I 0; x 1] = [R 0; Rx+t 1]
  pretranslate(v: Vector3): Affine3 {
    return this;
  }

  rotate(q: Quaternion): Affine3 {
    return this;
  }

  prerotate(q: Quaternion): Affine3 {
    return this;
  }

  // [S 0; 0 1] * m[R 0; t 1] = [SR 0; St 1]
  scale(s: Vector3): Affine3 {
    this.matrix.data[0] *= s.x;
    this.matrix.data[4] *= s.x;
    this.matrix.data[8] *= s.x;
    this.matrix.data[12] *= s.x;
    
    this.matrix.data[1] *= s.y;
    this.matrix.data[5] *= s.y;
    this.matrix.data[9] *= s.y;
    this.matrix.data[13] *= s.y;
    
    this.matrix.data[2] *= s.z;
    this.matrix.data[6] *= s.z;
    this.matrix.data[10] *= s.z;
    this.matrix.data[14] *= s.z;
    
    return this;
  }

  reflectZ(): Affine3 {
    this.matrix.data[2] *= -1.;
    this.matrix.data[6] *= -1.;
    this.matrix.data[10] *= -1.;
    this.matrix.data[14] *= -1.;

    return this;
  }
}
