#version 300 es

precision highp float;
precision highp int;

layout (location = 2) in vec2 uv;

uniform mat4 uModelMatrix;
uniform mat3 uInverseModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

out vec3 vPosition;
out vec3 vNormal;
out vec2 vUv;

const float pi = 3.141592;

void main() {
  vec3 position = vec3(cos(2. * (1. - uv.x) * pi), sin(2. * (1. - uv.x) * pi), (uv.y - 0.5) * 10.);
  vec3 normal = vec3(cos(2. * (1. - uv.x) * pi), sin(2. * (1. - uv.x) * pi), 0.);

  vec4 modelPosition = uModelMatrix * vec4(position, 1.);

  vPosition = modelPosition.xyz / modelPosition.w;
  vNormal = uInverseModelMatrix * normal;
  vUv = uv;
  
  gl_Position = uProjectionMatrix * uViewMatrix * modelPosition;
}
