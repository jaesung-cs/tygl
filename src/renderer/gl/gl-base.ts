export type GL = WebGL2RenderingContext;
export abstract class GlBase {
  readonly gl: GL;

  constructor(gl: GL) {
    this.gl = gl;
  }
}
