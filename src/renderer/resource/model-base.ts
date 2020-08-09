import { GL } from '../gl/gl-base';

export abstract class ModelBase {
  protected readonly gl: GL;

  constructor(gl: GL) {
    this.gl = gl;
  }

  abstract draw(): void;
}
