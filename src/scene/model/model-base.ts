import { GL, GlBase } from '../../gl/gl-base';

export abstract class ModelBase extends GlBase {
  constructor(gl: GL) {
    super(gl);
  }

  abstract draw(): void;
}
