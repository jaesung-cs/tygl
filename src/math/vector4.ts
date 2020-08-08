import { Vector3 } from '.';

export class Vector4 {
  data: number[];

  constructor(x?: number, y?: number, z?: number, w?: number) {
    this.data = [x || 0, y || 0, z || 0, w || 0];
  }

  get x() { return this.data[0]; }
  set x(x: number) { this.data[0] = x; }

  get y() { return this.data[1]; }
  set y(y: number) { this.data[1] = y; }

  get z() { return this.data[2]; }
  set z(z: number) { this.data[2] = z; }

  get w() { return this.data[3]; }
  set w(w: number) { this.data[3] = w; }

  add(v: Vector4): Vector4 {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    this.w += v.w;

    return this;
  }

  sub(v: Vector4): Vector4 {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
    this.w -= v.w;

    return this;
  }

  multiplyByScalar(v: number): Vector4 {
    this.x *= v;
    this.y *= v;
    this.z *= v;
    this.w *= v;

    return this;
  }

  toVector3(v: Vector3): void {
    v.x = this.x / this.w;
    v.y = this.y / this.w;
    v.z = this.z / this.w;
  }
}
