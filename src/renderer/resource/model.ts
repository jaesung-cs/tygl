import { VertexArray, VertexArrayBuffer, ElementBuffer, DrawMode } from '../gl';
import { GL } from '../gl/gl-base';
import { ModelBase } from './model-base';

const AttributeIndexSize = {
  position: {index: 0, size: 3},
  normal: {index: 1, size: 3},
  texCoord: {index: 2, size: 2},
}

type AttributeStride = number;

interface AttributeOffset {
  position: number,
  normal: number,
  texCoord: number,
}

export interface Attributes {
  hasPosition?: boolean;
  hasNormal?: boolean;
  hasTexCoord?: boolean;
}

export interface Vertex {
  position?: number[],
  normal?: number[],
  texCoord?: number[],
}

export class Model extends ModelBase {
  static readonly sizeofFloat = 4;

  private vao: VertexArray;
  private vbo: VertexArrayBuffer;
  private ebo: ElementBuffer;

  private hasModelBegun: boolean = false;
  private modelAttributes: Attributes;

  private buffer: number[] = [];
  private elementBuffer: number[] = [];

  private hasElements: boolean = false;
  private count: number;

  private attributeStride: AttributeStride;
  private attributeOffset: AttributeOffset;

  private drawMode: DrawMode;

  constructor(gl: GL) {
    super(gl);

    this.vao = new VertexArray(gl);
    this.vbo = new VertexArrayBuffer(gl);
    this.ebo = new ElementBuffer(gl);
  }

  beginModel(attributes: Attributes, drawMode: DrawMode, hasElements: boolean = false) {
    if (this.hasModelBegun) {
      console.error('model construction has not been ended.');
      return;
    }

    this.drawMode = drawMode;
    this.modelAttributes = attributes;
    this.hasElements = hasElements;
    this.count = 0;
    this.hasModelBegun = true;

    this.attributeOffset = {
      position: 0,
      normal: 0,
      texCoord: 0,
    };
    this.attributeStride = 0;

    if (this.modelAttributes.hasPosition) {
      this.attributeOffset.position = this.attributeStride;
      this.attributeStride += Model.sizeofFloat * AttributeIndexSize.position.size;
    }
    if (this.modelAttributes.hasNormal) {
      this.attributeOffset.normal = this.attributeStride;
      this.attributeStride += Model.sizeofFloat * AttributeIndexSize.normal.size;
    }
    if (this.modelAttributes.hasTexCoord) {
      this.attributeOffset.texCoord = this.attributeStride;
      this.attributeStride += Model.sizeofFloat * AttributeIndexSize.texCoord.size;
    }
  }

  addVertex(...vertices: Vertex[]) {
    const scope = this;

    vertices.forEach(vertex => {
      if (scope.modelAttributes.hasPosition) {
        if (vertex.position) {
          scope.buffer.push(...vertex.position);
        } else {
          scope.buffer.push(0, 0, 0);
        }
      }
      if (scope.modelAttributes.hasNormal) {
        if (vertex.normal) {
          scope.buffer.push(...vertex.normal);
        } else {
          scope.buffer.push(1, 0, 0);
        }
      }
      if (scope.modelAttributes.hasTexCoord) {
        if (vertex.texCoord) {
          scope.buffer.push(...vertex.texCoord);
        } else {
          scope.buffer.push(0, 0);
        }
      }
    });
  }

  addElementIndex(...indices: number[]) {
    this.elementBuffer.push(...indices);
    this.count += indices.length;
  }

  endModel() {
    if (!this.hasModelBegun) {
      console.error('model construction has not begun');
      return;
    }

    this.hasModelBegun = false;

    this.vao.bind();

    if (this.hasElements) {
      this.ebo.bind();
      this.ebo.bufferData(new Int32Array(this.elementBuffer));
      this.elementBuffer = [];
    }

    this.vbo.bind();
    this.vbo.bufferData(new Float32Array(this.buffer));
    this.buffer = [];

    this.setVaoAttribute(
      this.modelAttributes.hasPosition,
      AttributeIndexSize.position.index,
      AttributeIndexSize.position.size,
      this.attributeOffset.position
    );
    this.setVaoAttribute(
      this.modelAttributes.hasNormal,
      AttributeIndexSize.normal.index,
      AttributeIndexSize.normal.size,
      this.attributeOffset.normal
    );
    this.setVaoAttribute(
      this.modelAttributes.hasTexCoord,
      AttributeIndexSize.texCoord.index,
      AttributeIndexSize.texCoord.size,
      this.attributeOffset.texCoord
    );

    this.vbo.unbind();
    this.vao.unbind();
    if (this.hasElements) {
      this.ebo.unbind();
    }

    if (this.hasElements) {
      this.vao.setDrawElementMode(this.drawMode, this.count);
    } else {
      this.vao.setDrawArrayMode(this.drawMode, this.count);
    }
  }

  draw() {
    this.vao.bind();
    this.vao.draw();
    this.vao.unbind();
  }

  private setVaoAttribute(hasAttribute: boolean, index: number, size: number, offset: number) {
    if (hasAttribute) {
      this.gl.enableVertexAttribArray(index);
      this.gl.vertexAttribPointer(index, size, this.gl.FLOAT, false, this.attributeStride, offset);
    } else {
      this.gl.disableVertexAttribArray(index);
      if (size == 1) {
        this.gl.vertexAttrib1f(index, 0);
      } else if (size == 2) {
        this.gl.vertexAttrib2f(index, 0, 0);
      } else if (size == 3) {
        this.gl.vertexAttrib3f(index, 0, 0, 0);
      } else if (size == 4) {
        this.gl.vertexAttrib4f(index, 0, 0, 0, 0);
      }
    }
  }
}
