#version 300 es

precision highp float;
precision highp int;

layout (location = 2) in vec2 uv;

uniform mat4 uModelMatrix;
uniform mat3 uInverseModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

void main() {
  gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(uv, 0., 1.);
}
