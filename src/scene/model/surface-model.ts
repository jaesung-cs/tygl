import { GL } from '../../gl/gl-base';
import { DrawMode } from '../../gl';
import { Model } from '.';

export class SurfaceModel extends Model {
  private readonly numSegments = 32;

  constructor(gl: GL) {
    super(gl);

    this.beginModel({
      hasTexCoord: true,
    }, DrawMode.TRIANGLE_STRIP, true);

    // x: [0, 1]
    for (let yIndex = 0; yIndex <= this.numSegments; yIndex++) {
      const y = yIndex / this.numSegments;
      for (let xIndex = 0; xIndex <= this.numSegments; xIndex++) {
        const x = xIndex / this.numSegments;
        this.addVertex({texCoord: [x, y]});
      }
    }

    for (let yIndex = 0; yIndex < this.numSegments; yIndex++) {
      for (let xIndex = 0; xIndex <= this.numSegments; xIndex++) {
        this.addElementIndex(xIndex + (yIndex + 1) * (this.numSegments + 1));
        this.addElementIndex(xIndex + yIndex * (this.numSegments + 1));
      }
      this.addElementIndex(-1);
    }

    this.endModel();
  }
}
