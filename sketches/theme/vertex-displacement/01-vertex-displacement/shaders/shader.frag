uniform vec3 diffuse;
varying vec3 vPos;
varying vec3 vNormal;


#if NUM_POINT_LIGHTS > 0
struct PointLight {
  vec3 position;
  vec3 color;
};
uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
#endif

#if NUM_DIR_LIGHTS > 0
struct DirectionalLight {
   vec3 direction;
   vec3 color;
   int shadow;
   float shadowBias;
   float shadowRadius;
   vec2 shadowMapSize;
};
uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
#endif

uniform vec3 ambientLightColor;

void main() {
  vec4 addedLights = vec4(0.0,0.0,0.0, 1.0);
  for(int l = 0; l < NUM_POINT_LIGHTS; l++) {

    vec3 lightDirection = normalize(vPos - pointLights[l].position);
    vec3 Idiff = clamp(dot(-lightDirection, vNormal * 10.0), 0.0, 1.0) * pointLights[l].color;
    addedLights = addedLights + vec4(Idiff.rgb, 0.0); // + ;
  }

  gl_FragColor =  mix(vec4(diffuse.x, diffuse.y, diffuse.z, 1.0), addedLights, addedLights);
}