#version 300 es

precision highp float;
precision highp int;

layout (location = 0) in vec3 position;
layout (location = 1) in vec3 normal;
layout (location = 2) in vec2 texCoord;

uniform mat4 uModelMatrix;
uniform mat3 uInverseModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

out vec3 vPosition;
out vec3 vNormal;
out vec2 vTexCoord;

void main() {
  vec4 modelPosition = uModelMatrix * vec4(position, 1.);

  vPosition = modelPosition.xyz / modelPosition.w;
  vNormal = uInverseModelMatrix * normal;
  vTexCoord = texCoord;
  
  gl_Position = uProjectionMatrix * uViewMatrix * modelPosition;
}
