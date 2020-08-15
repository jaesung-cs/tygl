#version 300 es

precision highp float;
precision highp int;

in vec3 vPosition;
in vec3 vNormal;
in vec2 vTexCoord;

uniform bool uHasDiffuseTexture;
uniform sampler2D uDiffuseTexture;

out vec4 fragColor;

void main() {
  vec3 diffuseColor;

  if (uHasDiffuseTexture) {
    diffuseColor = texture(uDiffuseTexture, vTexCoord).rgb;
  } else {
    diffuseColor = vec3(0., 1., 0.);
  }

  fragColor = vec4(diffuseColor, 1.);
}
