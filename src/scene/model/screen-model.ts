import { GL } from '../../gl/gl-base';
import { DrawMode } from '../../gl';
import { Model } from '.';

export class ScreenModel extends Model {
  constructor(gl: GL) {
    super(gl);

    this.beginModel({
      hasTexCoord: true,
    }, DrawMode.TRIANGLE_STRIP);

    this.addVertex(
      {texCoord: [0, 0]},
      {texCoord: [1, 0]},
      {texCoord: [0, 1]},
      {texCoord: [1, 1]},
    );

    this.endModel();
  }
}
