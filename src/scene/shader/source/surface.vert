#version 300 es

precision highp float;
precision highp int;

layout (location = 2) in vec2 uv;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

out vec2 vUv;

const float pi = 3.141592;

void main() {
  vUv = uv;
  
  // TODO: compute position from uv coord
  gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(cos(2. * (1. - uv.x) * pi), uv.y * 10., 2. + sin(2. * (1. - uv.x) * pi), 1.);
}
