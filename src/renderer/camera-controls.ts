import { Camera } from '../scene';

export class CameraControls {
  private camera: Camera;
  private element: HTMLElement

  constructor(camera: Camera, element: HTMLElement) {
    this.camera = camera;
    this.element = element;
  }
}
