import { Matrix3 } from '.';

export class Quaternion {
  // x, y, z, w
  data: number[] = [0, 0, 0, 1];

  get x() { return this.data[0]; }
  set x(x: number) { this.data[0] = x; }

  get y() { return this.data[1]; }
  set y(y: number) { this.data[1] = y; }

  get z() { return this.data[2]; }
  set z(z: number) { this.data[2] = z; }

  get w() { return this.data[3]; }
  set w(w: number) { this.data[3] = w; }

  toMatrix(result: Matrix3): void {
    result.data[0] = 1. - 2. * (this.yy() + this.zz());
    result.data[1] = 2. * (this.xy() + this.zw());
    result.data[2] = 2. * (this.xz() - this.yw());

    result.data[3] = 2. * (this.xy() - this.zw());
    result.data[4] = 1. - 2. * (this.xx() + this.zz());
    result.data[5] = 2. * (this.yz() + this.xw());

    result.data[6] = 2. * (this.xz() + this.yw());
    result.data[7] = 2. * (this.yz() - this.xw());
    result.data[8] = 1. - 2. * (this.xx() + this.xy());
  }

  length(): number { return Math.sqrt(this.xx() + this.yy() + this.zz() + this.ww()); }

  normalize(): Quaternion {
    this.multiplyScalar(1. / this.length());
    return this;
  }

  multiply(q: Quaternion): Quaternion {
    let result: number[] = [
      this.w * q.w - this.x * q.x - this.y * q.y - this.z * q.z,
      this.w * q.x + this.x * q.w + this.y * q.z - this.z * q.y,
      this.w * q.y - this.x * q.z + this.y * q.w + this.z * q.x,
      this.w * q.z + this.x * q.y - this.y * q.x + this.z * q.w,
    ];

    this.x = result[0];
    this.y = result[1];
    this.z = result[2];
    this.w = result[3];

    return this;
  }

  multiplyScalar(v: number): Quaternion {
    this.x *= v;
    this.y *= v;
    this.z *= v;
    this.w *= v;

    return this;
  }
  
  private xx() { return this.x * this.x; }
  private xy() { return this.x * this.y; }
  private xz() { return this.x * this.z; }
  private xw() { return this.x * this.w; }
  private yy() { return this.y * this.y; }
  private yz() { return this.y * this.z; }
  private yw() { return this.y * this.w; }
  private zz() { return this.z * this.z; }
  private zw() { return this.z * this.w; }

  private ww() { return this.w * this.w; }
}
