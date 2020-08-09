import { Camera } from '../scene';
import { Vector3 } from '../math';

const enum MouseButton {
  LEFT = 0,
  MIDDLE = 1,
  RIGHT = 2,
}

export class CameraControls {
  private camera: Camera;
  private element: HTMLElement;

  center: Vector3;

  // eye in spherical coordinate: (cos theta sin phi, sin theta sin phi, cos phi)
  private distance: number;
  private theta: number = 0.;
  private phi: number = Math.PI / 2.;

  private minPhi = 0.01;

  // Mosue event
  private mouseStatus: boolean[] = [false, false];
  private mouseLastX: number = 0;
  private mouseLastY: number = 0;

  // Keyboard event
  // TODO: pairing codes and status and use for-each loop in onKeyUp/Down event handlers
  private codes: string[] = ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'Space'];
  private keyStatus: boolean[] = [];

  // Motion sensitivities
  private rotationSensitivity: number = 0.003;
  private translationSensitivity: number = 0.003;
  private motionSpeed: number = 0.002;
  private zoomDampingFactor: number = 0.997;

  constructor(camera: Camera, element: HTMLElement, distance?: number) {
    this.camera = camera;
    this.element = element;
    this.distance = distance || 1.;

    // Get spherical coordinates from camera direction
    this.phi = Math.acos(-camera.direction.z);
    this.theta = Math.asin(-camera.direction.y / Math.sin(this.phi));

    this.center = camera.eye.clone().add(camera.direction.clone().multiplyByScalar(this.distance));

    // Status initialization
    const keyStatus = this.keyStatus;
    this.codes.forEach(_ => { keyStatus.push(false); });

    element.addEventListener('mousedown', this.onMouseDown);
    element.addEventListener('mousemove', this.onMouseMove);
    element.addEventListener('mouseup', this.onMouseUp);

    // Delete opening context menu on right click
    element.addEventListener('contextmenu', (ev) => { ev.preventDefault(); });

    element.addEventListener('wheel', this.onWheel);

    // TODO: add key events not on window but on element
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
  }

  update(dt: number) {
    const sinPhi = Math.sin(this.phi);

    this.moveCameraCenterByKeyboardMotion(dt);

    // Set camera eye
    this.camera.eye.set(
      Math.cos(this.theta) * sinPhi,
      Math.sin(this.theta) * sinPhi,
      Math.cos(this.phi)
    ).multiplyByScalar(this.distance).add(this.center);

    // Set camera direction
    this.camera.lookAt(this.center);
  }

  private onMouseDown = (event: MouseEvent) => {
    event.preventDefault();

    switch (event.button) {
    case MouseButton.LEFT:
      this.mouseStatus[0] = true;
      break;
    case MouseButton.RIGHT:
      this.mouseStatus[1] = true;
      break;
    }
    
    this.mouseLastX = event.clientX;
    this.mouseLastY = event.clientY;
  }

  private onMouseMove = (event: MouseEvent) => {
    event.preventDefault();

    const dx = event.clientX - this.mouseLastX;
    const dy = event.clientY - this.mouseLastY;

    if (this.mouseStatus[0] && !this.mouseStatus[1]) {
      // Left drag = Rotating
      this.rotateByPixels(dx, dy);
    } else if (!this.mouseStatus[0] && this.mouseStatus[1]) {
      // Right drag = Translating
      this.translateByPixels(dx, dy);
    } else if (this.mouseStatus[0] && this.mouseStatus[1]) {
      // TODO: Left + right drag = Zoom in/out
    }

    this.mouseLastX = event.clientX;
    this.mouseLastY = event.clientY;
  }

  private onMouseUp = (event: MouseEvent) => {
    event.preventDefault();
    
    switch (event.button) {
    case MouseButton.LEFT:
      this.mouseStatus[0] = false;
      break;
    case MouseButton.RIGHT:
      this.mouseStatus[1] = false;
      break;
    }
  }

  private onWheel = (event: WheelEvent) => {
    event.preventDefault();
    this.zoomByPixels(event.deltaY);
  }

  private onKeyDown = (event: KeyboardEvent) => {
    for (let i = 0; i < this.codes.length; i++) {
      if (this.codes[i] === event.code) {
        this.keyStatus[i] = true;
        break;
      }
    }
  }

  private onKeyUp = (event: KeyboardEvent) => {
    for (let i = 0; i < this.codes.length; i++) {
      if (this.codes[i] === event.code) {
        this.keyStatus[i] = false;
        break;
      }
    }
  }

  private rotateByPixels(dx: number, dy: number) {
    this.theta += -dx * this.rotationSensitivity;

    let newPhi = this.phi - dy * this.rotationSensitivity;
    if (newPhi < this.minPhi) {
      newPhi = this.minPhi;
    } else if (newPhi > Math.PI - this.minPhi) {
      newPhi = Math.PI - this.minPhi;
    }

    this.phi = newPhi;
  }

  private translateByPixels(dx: number, dy: number) {
    // eye in spherical coordinate: (cos theta sin phi, sin theta sin phi, cos phi)
    const sinTheta = Math.sin(this.theta);
    const cosTheta = Math.cos(this.theta);
    let x = new Vector3(this.distance * sinTheta, this.distance * -cosTheta, 0.);

    const cosPhi = Math.cos(this.phi);
    let y = new Vector3(cosTheta * -cosPhi, sinTheta * -cosPhi, Math.sin(this.phi)).multiplyByScalar(this.distance);

    this.center.add(x.multiplyByScalar(dx * this.translationSensitivity))
    .add(y.multiplyByScalar(dy * this.translationSensitivity));
  }

  private zoomByPixels(dy: number) {
    // dy < 0 => wheel up => zoom in
    // dy > 0 => wheel down => zoom out
    
    this.distance /= Math.pow(this.zoomDampingFactor, dy);
  }

  private moveCameraCenterByKeyboardMotion(dt: number) {
    // AD
    const sinTheta = Math.sin(this.theta);
    const cosTheta = Math.cos(this.theta);
    let x = new Vector3(-sinTheta, cosTheta, 0.)
      .multiplyByScalar(this.distance * dt * this.motionSpeed);

    // WS
    const sinPhi = Math.sin(this.phi);
    let z = new Vector3(-cosTheta * sinPhi, -sinTheta * sinPhi, -Math.cos(this.phi))
      .multiplyByScalar(this.distance * dt * this.motionSpeed);

    let up = this.camera.up.clone().multiplyByScalar(this.distance * dt * this.motionSpeed);

    if (this.keyStatus[0]) { // W
      this.center.add(z);
    }
    if (this.keyStatus[1]) { // A
      this.center.sub(x);
    }
    if (this.keyStatus[2]) { // S
      this.center.sub(z);
    }
    if (this.keyStatus[3]) { // D
      this.center.add(x);
    }
    if (this.keyStatus[4]) { // Space
      this.center.add(up);
    }
  }
}
