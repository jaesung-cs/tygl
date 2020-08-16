#version 300 es

precision highp float;
precision highp int;

layout (location = 2) in vec2 uv;

out vec2 vUv;

void main() {
  vUv = uv;
  
  gl_Position = vec4(uv * 2. - 1., 0., 1.);
}
