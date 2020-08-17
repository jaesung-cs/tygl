import {
  Vector3,
  Matrix4,
} from '../math';

export enum ProjectionMode {
  ORTHOGRAPHIC,
  PERSPECTIVE,
}

export class Camera {
  private projectionMode: ProjectionMode = ProjectionMode.PERSPECTIVE;

  private up_: Vector3 = new Vector3(0, 0, 1);
  private eye_: Vector3 = new Vector3(5, -5, 5);

  private direction_: Vector3 = new Vector3(-1, 1, -1).normalize();

  near: number = 0.1;
  far: number = 1000.;

  // Orthographic
  left: number = -1;
  right: number = 1;
  bottom: number = -1;
  top: number = 1;

  // Perspective
  fov: number = 60. * (Math.PI / 180.);
  aspect: number = 1.;

  // TODO: vector getter replaced with returning clone,
  // and change not to use getters in internal methods accordingly
  get up(): Vector3 { return this.up_; }
  set up(v: Vector3) { this.up_.copy(v); }

  get eye(): Vector3 { return this.eye_; }
  set eye(v: Vector3) { this.eye_.copy(v); }

  get direction(): Vector3 { return this.direction_; }
  set direction(v: Vector3) { this.direction_.copy(v); }

  lookAt(center: Vector3) {
    this.direction.copy(center).sub(this.eye).normalize();
  }

  viewMatrix(result: Matrix4) {
    let z = this.direction.clone().negate().normalize();
    let x = this.up.clone().cross(z).normalize();
    let y = z.clone().cross(x);

    result.data[0] = x.x;
    result.data[1] = y.x;
    result.data[2] = z.x;
    result.data[3] = 0;
    
    result.data[4] = x.y;
    result.data[5] = y.y;
    result.data[6] = z.y;
    result.data[7] = 0;
    
    result.data[ 8] = x.z;
    result.data[ 9] = y.z;
    result.data[10] = z.z;
    result.data[11] = 0;
    
    result.data[12] = -x.dot(this.eye);
    result.data[13] = -y.dot(this.eye);
    result.data[14] = -z.dot(this.eye);
    result.data[15] = 1;
  }

  projectionMatrix(result: Matrix4) {
    switch (this.projectionMode) {
    case ProjectionMode.ORTHOGRAPHIC:
      this.projectionMatrixOrthographic(result);
      break;
    case ProjectionMode.PERSPECTIVE:
      this.projectionMatrixPerspective(result);
      break;
    }
  }

  projectionMatrixOrthographic(result: Matrix4) {
    result.data[0] = 2. / (this.right - this.left);
    result.data[1] = 0;
    result.data[2] = 0;
    result.data[3] = 0;
    
    result.data[4] = 0;
    result.data[5] = 2. / (this.top - this.bottom);
    result.data[6] = 0;
    result.data[7] = 0;
    
    result.data[ 8] = 0;
    result.data[ 9] = 0;
    result.data[10] = -2. / (this.far - this.near);
    result.data[11] = 0;
    
    result.data[12] = - (this.right + this.left) / (this.right - this.left);
    result.data[13] = - (this.top + this.bottom) / (this.top - this.bottom);
    result.data[14] = - (this.far + this.near) / (this.far - this.near);
    result.data[15] = 1;
  }

  projectionMatrixPerspective(result: Matrix4) {
    const t = Math.tan(this.fov / 2.);

    result.data[0] = 1. / t / this.aspect;
    result.data[1] = 0;
    result.data[2] = 0;
    result.data[3] = 0;
    
    result.data[4] = 0;
    result.data[5] = 1. / t;
    result.data[6] = 0;
    result.data[7] = 0;
    
    result.data[ 8] = 0;
    result.data[ 9] = 0;
    result.data[10] = - (this.far + this.near) / (this.far - this.near);
    result.data[11] = -1;
    
    result.data[12] = 0;
    result.data[13] = 0;
    result.data[14] = - 2. * this.far * this.near / (this.far - this.near);
    result.data[15] = 0;
  }
}
