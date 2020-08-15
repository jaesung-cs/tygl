export type GL = WebGL2RenderingContext;

export abstract class GlBase {
  protected readonly gl: GL;

  constructor(gl: GL) {
    this.gl = gl;
  }
}
