import { Vector3, Quaternion } from '.';

export class Affine3 {
  private rotation_: Quaternion = new Quaternion();
  private translation_: Vector3 = new Vector3();

  get rotation() { return this.rotation_; }
  set rotation(q: Quaternion) { this.rotation_ = q; }

  get translation() { return this.translation_; }
  set translation(t: Vector3) { this.translation_ = t; }

  constructor() {
  }

  // Multiply translation matrix on the left
  // [I 0; x 1] * [R 0; t 1] = [R 0; x+t 1]
  translate(x: Vector3): Affine3 {
    return this;
  }

  // Multiply translation matrix on the right
  // [R 0; t 1] * [I 0; x 1] = [R 0; Rx+t 1]
  pretranslate(x: Vector3): Affine3 {
    return this;
  }

  rotate(q: Quaternion): Affine3 {
    return this;
  }

  prerotate(q: Quaternion): Affine3 {
    return this;
  }
}
