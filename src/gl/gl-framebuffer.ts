import { GL, GlBase } from './gl-base';
import { GlTexture2D, GlDepthStencilTexture } from './gl-texture';

export class GlFramebuffer extends GlBase {
  readonly framebuffer: WebGLFramebuffer;

  constructor(gl: GL) {
    super(gl);

    this.framebuffer = gl.createFramebuffer();
  }

  dispose() {
    const gl = this.gl;
    gl.deleteFramebuffer(this.framebuffer);
  }

  bind() {
    const gl = this.gl;
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
  }

  bindForRead() {
    const gl = this.gl;
    gl.bindFramebuffer(gl.READ_FRAMEBUFFER, this.framebuffer);
  }

  bindForDraw() {
    const gl = this.gl;
    gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.framebuffer);
  }

  unbind() {
    const gl = this.gl;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  unbindForRead() {
    const gl = this.gl;
    gl.bindFramebuffer(gl.READ_FRAMEBUFFER, null);
  }

  unbindForDraw() {
    const gl = this.gl;
    gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);
  }

  attachColor(index: number, texture: GlTexture2D) {
    const gl = this.gl;
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0 + index, gl.TEXTURE_2D, texture.texture, 0);
  }

  attachDepthStencil(texture: GlDepthStencilTexture) {
    const gl = this.gl;
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.TEXTURE_2D, texture.texture, 0);
  }

  checkStatus() {
    const gl = this.gl;
    const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    switch (status) {
    case gl.FRAMEBUFFER_COMPLETE:
      break;
    case gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
      console.error('Framebuffer incomplete attachment');
      break;
    case gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:
      console.error('Framebuffer incomplete dimensions');
      break;
    case gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:
      console.error('Framebuffer incomplete missing attachment')
      break;
    case gl.FRAMEBUFFER_INCOMPLETE_MULTISAMPLE:
      console.error('Framebuffer incomplete multisample');
      break;
    }
  }
}
