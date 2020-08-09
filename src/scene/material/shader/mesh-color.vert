#version 300 es

precision highp float;
precision highp int;

layout (location = 0) in vec3 position;
layout (location = 1) in vec3 color;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

out vec3 vColor;

void main() {
  vColor = color;

  gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(position, 1.);
}
