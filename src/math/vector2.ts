export class Vector2 {
  data: number[];

  constructor(x?: number, y?: number) {
    this.data = [x || 0, y || 0];
  }

  get x() { return this.data[0]; }
  set x(x: number) { this.data[0] = x; }

  get y() { return this.data[1]; }
  set y(y: number) { this.data[1] = y; }

  copy(v: Vector2): Vector2 {
    this.x = v.x;
    this.y = v.y;

    return this;
  }

  add(v: Vector2): Vector2 {
    this.x += v.x;
    this.y += v.y;

    return this;
  }
  
  translate(v: Vector2): Vector2 {
    this.x += v.x;
    this.y += v.y;

    return this;
  }

  sub(v: Vector2): Vector2 {
    this.x -= v.x;
    this.y -= v.y;

    return this;
  }

  multiplyByScalar(s: number): Vector2 {
    this.x *= s;
    this.y *= s;

    return this;
  }

  length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  normalize(): Vector2 {
    return this.multiplyByScalar(1. / this.length());
  }

  cross(v: Vector2): number {
    return this.x * v.y - this.y * v.x;
  }
}
