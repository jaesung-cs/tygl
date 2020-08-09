import { Affine3 } from './';

export class Matrix4 {
  data: number[] = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

  fromAffine(affine: Affine3): Matrix4 {
    affine.rotation.toMatrix4(this);

    this.data[12] = affine.translation.x;
    this.data[13] = affine.translation.y;
    this.data[14] = affine.translation.z;

    return this;
  }
}
