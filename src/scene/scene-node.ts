import { Affine3 } from '../math';

export class SceneNode {
  transform: Affine3 = new Affine3();

  private parent: SceneNode = undefined;
  private children: Set<SceneNode> = new Set();

  addChild(child: SceneNode) {
    this.children.add(child);

    if (child.parent && child.parent != this) {
      child.parent.removeChild(child);
    }
    child.parent = this;
  }

  removeChild(child: SceneNode) {
    this.children.delete(child);
  }

  detachFromParent() {
    if (this.parent) {
      this.parent.removeChild(this);
      this.parent = undefined;
    }
  }
}
