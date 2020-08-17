import { GL, GlBase } from '../../gl/gl-base';
import { GlVertexShader, GlFragmentShader, GlProgram } from '../../gl';
import { Camera } from '../camera';
import { Matrix3, Matrix4, Affine3 } from '../../math';
import { Light, LightType } from '../light';
import { Material } from '../material';

interface IDefaultUniforms {
  uProjectionMatrix: Matrix4,
  uViewMatrix: Matrix4,
  uModelMatrix: Matrix4,
  uInverseModelMatrix: Matrix3,
}

export class Shader extends GlBase {
  protected program: GlProgram;

  protected uniforms: IDefaultUniforms = {
    uProjectionMatrix: new Matrix4(),
    uViewMatrix: new Matrix4(),
    uModelMatrix: new Matrix4(),
    uInverseModelMatrix: new Matrix3(),
  };

  constructor(gl: GL, vertexShaderSource: string, fragmentShaderSource: string) {
    super(gl);

    const vertexShader = new GlVertexShader(gl, vertexShaderSource);
    const fragmentShader = new GlFragmentShader(gl, fragmentShaderSource);

    this.program = new GlProgram(gl, vertexShader, fragmentShader);

    vertexShader.dispose();
    fragmentShader.dispose();
  }

  updateCameraUniforms(camera: Camera) {
    camera.projectionMatrix(this.uniforms.uProjectionMatrix);
    camera.viewMatrix(this.uniforms.uViewMatrix);

    this.program.uniformMatrix4f('uProjectionMatrix', this.uniforms.uProjectionMatrix);
    this.program.uniformMatrix4f('uViewMatrix', this.uniforms.uViewMatrix);
    this.program.uniform3fv('uEye', camera.eye);
  }

  updateModelMatrix(transform: Affine3) {
    this.uniforms.uModelMatrix.fromAffine(transform);
    this.uniforms.uInverseModelMatrix.fromRotationPart(this.uniforms.uModelMatrix).inverse().transpose();

    this.program.uniformMatrix4f('uModelMatrix', this.uniforms.uModelMatrix);
    this.program.uniformMatrix3f('uInverseModelMatrix', this.uniforms.uInverseModelMatrix);
  }

  setNumLights(numLights: number) {
    this.program.uniform1i('uNumLights', numLights);
  }

  setLight(index: number, light: Light) {
    const lightName = 'uLights[' + index + ']';
    this.program.uniform1i(lightName + '.type', light.type == LightType.DIRECTIONAL ? 0 : 1);
    this.program.uniform3fv(lightName + '.position', light.position);
    this.program.uniform3fv(lightName + '.ambient', light.ambient);
    this.program.uniform3fv(lightName + '.diffuse', light.diffuse);
    this.program.uniform3fv(lightName + '.specular', light.specular);
  }

  setMaterial(material: Material) {
    this.program.uniform3fv('uMaterial.ambient', material.ambient);
    this.program.uniform3fv('uMaterial.diffuse', material.diffuse);
    this.program.uniform3fv('uMaterial.specular', material.specular);
    this.program.uniform1f('uMaterial.shininess', material.shininess);
  }

  use() {
    this.program.use();
  }
}
