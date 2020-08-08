import { SceneNode } from './scene-node';
import { Model } from '../renderer/resource/model';

export class Object3D extends SceneNode {
  model: Model;

  constructor(model: Model) {
    super();
    
    this.model = model;
  }
}
