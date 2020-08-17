import { Vector3 } from "../../math";

export enum LightType {
  DIRECTIONAL,
  POINT,
}

export class Light {
  type: LightType = LightType.DIRECTIONAL;
  position: Vector3 = new Vector3(0., 0., 1.);
  ambient: Vector3 = new Vector3(1., 1., 1.);
  diffuse: Vector3 = new Vector3(1., 1., 1.);
  specular: Vector3 = new Vector3(1., 1., 1.);
}
