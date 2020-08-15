import { Affine3 } from './';

export class Matrix4 {
  data: number[] = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

  copy(m: Matrix4) {
    for (let i = 0; i < 16; i++) {
      this.data[i] = m.data[i];
    }
  }

  fromAffine(affine: Affine3): Matrix4 {
    affine.toMatrix(this);
    return this;
  }

  setIdentity(): Matrix4 {
    this.data[0] = 1;
    this.data[1] = 0;
    this.data[2] = 0;
    this.data[3] = 0;
    
    this.data[4] = 0;
    this.data[5] = 1;
    this.data[6] = 0;
    this.data[7] = 0;
    
    this.data[ 8] = 0;
    this.data[ 9] = 0;
    this.data[10] = 1;
    this.data[11] = 0;
    
    this.data[12] = 0;
    this.data[13] = 0;
    this.data[14] = 0;
    this.data[15] = 1;

    return this;
  }
}
