#version 300 es

precision highp float;
precision highp int;

layout (location = 2) in vec2 uv;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

out vec2 vUv;

void main() {
  vUv = uv;
  
  // TODO: compute position from uv coord
  gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(uv, 0., 1.);
}
