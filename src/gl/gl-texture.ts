import { GlBase, GL } from "./gl-base";

export enum TextureFilter {
  LINEAR,
  NEAREST,
}

export enum TextureWrap {
  REPEAT,
  CLAMP_TO_EDGE,
}

abstract class GlTexture extends GlBase {
  readonly texture: WebGLTexture;

  private format: number;

  private width: number;
  private height: number;

  constructor(gl: GL, format: number) {
    super(gl);

    this.format = format;
    this.texture = gl.createTexture();
  }

  dispose() {
    this.gl.deleteTexture(this.texture);
  }

  bind() {
    const gl = this.gl;
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
  }

  unbind() {
    const gl = this.gl;
    gl.bindTexture(gl.TEXTURE_2D, null);
  }

  storage(width: number, height: number) {
    const gl = this.gl;

    gl.texStorage2D(gl.TEXTURE_2D, 1, this.format, width, height);

    this.width = width;
    this.height = height;
  }

  filter(minFilter: TextureFilter, magFilter: TextureFilter) {
    const gl = this.gl;
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this.filterToGlType(minFilter));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this.filterToGlType(magFilter));
  }

  wrap(wrapS: TextureWrap, wrapT: TextureWrap) {
    const gl = this.gl;
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, this.wrapToGlType(wrapS));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this.wrapToGlType(wrapT));
  }

  private filterToGlType(filter: TextureFilter) {
    const gl = this.gl;
    switch (filter) {
    case TextureFilter.LINEAR: return gl.LINEAR;
    case TextureFilter.NEAREST: return gl.NEAREST;
    default: return 0;
    }
  }

  private wrapToGlType(wrap: TextureWrap) {
    const gl = this.gl;

    switch (wrap) {
    case TextureWrap.CLAMP_TO_EDGE: return gl.CLAMP_TO_EDGE;
    case TextureWrap.REPEAT: return gl.REPEAT;
    default: return 0;
    }
  }
}

export class GlTexture2D extends GlTexture {
  constructor(gl: GL) {
    super(gl, gl.RGBA8);
  }
}

export class GlDepthStencilTexture extends GlTexture {
  constructor(gl: GL) {
    super(gl, gl.DEPTH24_STENCIL8);
  }
}
