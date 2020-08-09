export class Vector3 {
  data: number[];

  constructor(x?: number, y?: number, z?: number) {
    this.data = [x || 0, y || 0, z || 0];
  }

  get x() { return this.data[0]; }
  set x(x: number) { this.data[0] = x; }

  get y() { return this.data[1]; }
  set y(y: number) { this.data[1] = y; }

  get z() { return this.data[2]; }
  set z(z: number) { this.data[2] = z; }

  copy(v: Vector3): Vector3 {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;

    return this;
  }

  set(x: number, y: number, z: number): Vector3 {
    this.x = x;
    this.y = y;
    this.z = z;

    return this;
  }

  clone(): Vector3 {
    return new Vector3(this.x, this.y, this.z);
  }

  add(v: Vector3): Vector3 {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;

    return this;
  }
  
  translate(v: Vector3): Vector3 {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;

    return this;
  }

  sub(v: Vector3): Vector3 {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;

    return this;
  }

  multiplyByScalar(s: number): Vector3 {
    this.x *= s;
    this.y *= s;
    this.z *= s;

    return this;
  }

  negate(): Vector3 {
    return this.multiplyByScalar(-1.);
  }

  length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  normalize(): Vector3 {
    return this.multiplyByScalar(1. / this.length());
  }

  dot(v: Vector3): number {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }

  cross(v: Vector3): Vector3 {
    let data: number[] = [
      this.y * v.z - this.z * v.y,
      this.z * v.x - this.x * v.z,
      this.x * v.y - this.y * v.x,
    ];

    this.x = data[0];
    this.y = data[1];
    this.z = data[2];

    return this;
  }
}
