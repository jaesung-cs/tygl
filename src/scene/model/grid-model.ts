import { GL } from '../../gl/gl-base';
import { DrawMode } from '../../gl';
import { Model } from '.';

export class GridModel extends Model {
  private readonly numGrids = 100.;
  private readonly color = [0.7, 0.7, 0.7];

  constructor(gl: GL) {
    super(gl);

    this.beginModel({
      hasPosition: true,
      hasNormal: true,
    }, DrawMode.LINES);

    for (let i = -this.numGrids; i <= this.numGrids; i++) {
      this.addVertex(
        {position: [-this.numGrids, i, 0], normal: this.color},
        {position: [ this.numGrids, i, 0], normal: this.color},
      );
    }
    for (let i = -this.numGrids; i <= this.numGrids; i++) {
      this.addVertex(
        {position: [i, -this.numGrids, 0], normal: this.color},
        {position: [i,  this.numGrids, 0], normal: this.color},
      );
    }

    this.endModel();
  }
}
