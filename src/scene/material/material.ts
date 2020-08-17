import { Vector3 } from "../../math";

export class Material {
  ambient: Vector3 = new Vector3(0.25, 0.25, 0.25);
  diffuse: Vector3 = new Vector3(0.25, 0.25, 0.25);
  specular: Vector3 = new Vector3(1., 1., 1.);
  shininess: number = 64.;
}
