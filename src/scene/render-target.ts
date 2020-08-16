import { GlBase, GL } from "../gl/gl-base";
import { GlFramebuffer, GlTexture2D, GlDepthStencilTexture } from "../gl";

export class RenderTarget extends GlBase {
  private framebuffer: GlFramebuffer;
  private texture: GlTexture2D;
  private depthTexture: GlDepthStencilTexture;
  private width: number;
  private height: number;

  constructor(gl: GL, width: number, height: number) {
    super(gl);

    this.framebuffer = new GlFramebuffer(gl);
    
    this.resize(width, height);
  }

  dispose() {
    this.framebuffer.dispose();
    this.texture.dispose();
    this.depthTexture.dispose();
  }

  resize(width: number, height: number) {
    const gl = this.gl;

    if (this.width != width || this.height != height) {
      this.width = width;
      this.height = height;

      if (this.texture) {
        this.texture.dispose();
      }
      this.texture = new GlTexture2D(gl);
      this.texture.bind();
      this.texture.storage(width, height);
      this.texture.unbind();

      if (this.depthTexture) {
        this.depthTexture.dispose();
      }
      this.depthTexture = new GlDepthStencilTexture(gl);
      this.depthTexture.bind();
      this.depthTexture.storage(width, height);
      this.depthTexture.unbind();

      this.framebuffer.bind();
      this.framebuffer.attachColor(0, this.texture);
      this.framebuffer.attachDepthStencil(this.depthTexture);
      this.framebuffer.unbind();
    }
  }

  use() {
    this.framebuffer.bind();
    this.framebuffer.checkStatus();
  }

  done() {
    this.framebuffer.unbind();
  }

  blitToScreen(screenWidth: number, screenHeight: number) {
    const gl = this.gl;
    this.framebuffer.bindForRead();
    gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);
    gl.blitFramebuffer(0, 0, this.width, this.height, 0, 0, screenWidth, screenHeight, gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT, gl.NEAREST);
    this.framebuffer.unbindForRead();
  }

  bindActiveTexture(index: number) {
    const gl = this.gl;
    gl.activeTexture(gl.TEXTURE0 + index);
    this.texture.bind();
  }
}
