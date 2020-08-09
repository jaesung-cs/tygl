import { GL } from '../../gl/gl-base';
import { DrawMode } from '../../gl';
import { Model } from '.';

export class SphereModel extends Model {
  private readonly thetaSegments = 20;
  private readonly phiSegments = 20;

  constructor(gl: GL) {
    super(gl);

    this.beginModel({
      hasPosition: true,
      hasNormal: true
    }, DrawMode.TRIANGLE_STRIP, true);

    this.addVertex(
      {position: [0, 0, 1], normal: [0, 0, 1]},
      {position: [0, 0, -1], normal: [0, 0, -1]},
    );
    this.addElementIndex(0, 1);

    for (let i = 0; i < this.thetaSegments; i++) {
      const theta = 2. * Math.PI * i / this.thetaSegments;

      const cosTheta = Math.cos(theta);
      const sinTheta = Math.sin(theta);

      this.addElementIndex(0);
      for (let j = 1; j < this.phiSegments; j++) {
        const phi = Math.PI * j / this.thetaSegments;

        const cosPhi = Math.cos(phi);
        const sinPhi = Math.sin(phi);

        let position = [cosTheta * sinPhi, sinTheta * sinPhi, cosPhi];
        this.addVertex({position: position, normal: position});
        this.addElementIndex(
          1 + i * (this.phiSegments - 1) + j,
          1 + ((i + 1) % this.thetaSegments) * (this.phiSegments - 1) + j
        );
      }
      this.addElementIndex(1, -1);
    }

    this.endModel();
  }
}
