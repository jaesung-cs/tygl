import { GL } from '../../gl/gl-base';
import { DrawMode } from '../../gl';
import { Model } from '.';

export class AxisModel extends Model {
  constructor(gl: GL) {
    super(gl);

    this.beginModel({
      hasPosition: true,
      hasNormal: true,
    }, DrawMode.LINES);

    const inf = 1000.;
    this.addVertex(
      {position: [-inf, 0, 0], normal: [1, 0, 0]},
      {position: [ inf, 0, 0], normal: [1, 0, 0]},
      {position: [0, -inf, 0], normal: [0, 1, 0]},
      {position: [0,  inf, 0], normal: [0, 1, 0]},
      {position: [0, 0, -inf], normal: [0, 0, 1]},
      {position: [0, 0,  inf], normal: [0, 0, 1]},
    );
    
    this.endModel();
  }
}
