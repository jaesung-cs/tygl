#version 300 es

precision highp float;
precision highp int;

in vec3 vPosition;
in vec3 vColor;

out vec4 fragColor;

void main() {
  fragColor = vec4(vColor, 1.);
}
