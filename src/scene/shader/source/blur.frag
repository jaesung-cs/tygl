#version 300 es

precision highp float;
precision highp int;

in vec2 vUv;

uniform sampler2D uTexture;
uniform vec2 uDirection;
uniform float uDistance;

const int NUM_SAMPLES = 6;
const vec2 sampleOffsetWeight[NUM_SAMPLES] = vec2[](
  vec2(0.0, 0.382925),
  vec2(1.0, 0.24173),
  vec2(2.0, 0.060598),
  vec2(3.0, 0.005977),
  vec2(4.0, 0.000229),
  vec2(5.0, 0.000003)
);

out vec4 fragColor;

vec4 blur(sampler2D tex, vec2 uv, vec2 direction, float dist) {
  vec2 v = direction * dist;

  vec4 total = sampleOffsetWeight[0].y * texture(tex, uv);
  
  for (int i = 1; i < NUM_SAMPLES; i++) {
    total += sampleOffsetWeight[i].y * texture(tex, uv - v * sampleOffsetWeight[i].x);
    total += sampleOffsetWeight[i].y * texture(tex, uv + v * sampleOffsetWeight[i].x);
  }

  return total;
}

void main() {
  fragColor = blur(uTexture, vUv, uDirection, uDistance);
  //fragColor = vec4(0, 1, 0, 1);
}
