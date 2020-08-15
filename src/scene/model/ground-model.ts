import { GL } from '../../gl/gl-base';
import { Model } from './model';
import { DrawMode } from '../../gl';

export class GroundModel extends Model {
  constructor(gl: GL) {
    super(gl);

    this.beginModel({
      hasTexCoord: true
    }, DrawMode.TRIANGLE_STRIP);

    this.addVertex(
      {texCoord: [-1, -1]},
      {texCoord: [1, -1]},
      {texCoord: [-1, 1]},
      {texCoord: [1, 1]},
    );

    this.endModel();
  }
}
