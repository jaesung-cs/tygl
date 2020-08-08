import {
  Vector3,
  Matrix4,
} from '../math';

export enum ProjectionMode {
  ORTHOGRAPHIC,
  PERSPECTIVE,
}

export class Camera {
  private projectionMode: ProjectionMode = ProjectionMode.ORTHOGRAPHIC;

  private up_: Vector3 = new Vector3();
  private eye_: Vector3 = new Vector3();

  private direction: Vector3 = new Vector3();

  // Orthographic
  left: number;
  right: number;
  bottom: number;
  top: number;

  // Perspective
  fov_: number;
  aspect_: number;

  get up(): Vector3 { return this.up_; }
  set up(v: Vector3) { this.up_.copy(v); }

  get eye(): Vector3 { return this.eye_; }
  set eye(v: Vector3) { this.eye_.copy(v); }

  lookAt(center: Vector3) {
    this.direction.copy(center).sub(this.eye).normalize();
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
    // TODO
    result.data[0] = 1;
    result.data[1] = 0;
    result.data[2] = 0;
    result.data[3] = 0;
    
    result.data[4] = 0;
    result.data[5] = 1;
    result.data[6] = 0;
    result.data[7] = 0;
    
    result.data[ 8] = 0;
    result.data[ 9] = 0;
    result.data[10] = 1;
    result.data[11] = 0;
    
    result.data[12] = 0;
    result.data[13] = 0;
    result.data[14] = 0;
    result.data[15] = 1;
  }

  projectionMatrixPerspective(result: Matrix4) {
    // TODO
    result.data[0] = 1;
    result.data[1] = 0;
    result.data[2] = 0;
    result.data[3] = 0;
    
    result.data[4] = 0;
    result.data[5] = 1;
    result.data[6] = 0;
    result.data[7] = 0;
    
    result.data[ 8] = 0;
    result.data[ 9] = 0;
    result.data[10] = 1;
    result.data[11] = 0;
    
    result.data[12] = 0;
    result.data[13] = 0;
    result.data[14] = 0;
    result.data[15] = 1;
  }
}
