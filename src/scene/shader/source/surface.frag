#version 300 es

precision highp float;
precision highp int;

in vec3 vPosition;
in vec3 vNormal;
in vec2 vUv;

const int MAX_NUM_LIGHTS = 8;

struct Light {
  int type; // 0: directional, 1: position
  vec3 position; // Assumed normalized if directional light
  vec3 ambient;
  vec3 diffuse;
  vec3 specular;
};

struct Material {
  vec3 ambient;
  vec3 diffuse;
  vec3 specular;
  float shininess;
};

uniform int uNumLights;
uniform Light uLights[MAX_NUM_LIGHTS];

uniform Material uMaterial;

uniform vec3 uEye;

out vec4 fragColor;

vec3 pointLight(Light light, vec3 normal, vec3 view) {
  float diffuseStrength = max(dot(normal, light.position), 0.);

  vec3 r = reflect(-light.position, normal);
  float specularStrength = pow(max(dot(view, r), 0.0), uMaterial.shininess);
  
  vec3 ambient = light.ambient * uMaterial.ambient;
  vec3 diffuse = diffuseStrength * light.diffuse * uMaterial.diffuse;
  vec3 specular = specularStrength * light.specular * uMaterial.specular;

  return ambient + diffuse + specular;
}

void main() {
  vec3 totalColor = vec3(0.);

  vec3 fragNormal = normalize(vNormal);
  vec3 view = normalize(uEye - vPosition);

  for (int i = 0; i < uNumLights; i++) {
    if (uLights[i].type == 0) {
      // Directional light
      totalColor += pointLight(uLights[i], fragNormal, view);
    }
    else if (uLights[i].type == 1) {
      // TODO: point light
    }
  }

  fragColor = vec4(totalColor, 1.);
}
