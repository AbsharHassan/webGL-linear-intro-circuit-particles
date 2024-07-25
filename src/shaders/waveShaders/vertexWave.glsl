precision highp float;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vOriginalPosition;

uniform float uTime;
uniform sampler2D uDoubleBufferTexture2;

uniform vec2 uResolution;
uniform float uProgress;
uniform float uWidth;
uniform float uHeight;

// void main() {
//   vUv = uv;

//   // float frequency = 0.8;
//   float frequency = 0.5;
//   float amplitude = 0.8;

//   float distance = length(position.xy);

//   vec4 bump = texture2D(uDoubleBufferTexture2, uv);

//   // float wave = abs(amplitude * sin(sin(frequency * distance - uTime * 0.3) * (frequency * distance - uTime * 0.6)));
//   float wave = abs(amplitude * sin(frequency * distance - uTime * 0.3));

//   wave -= 0.4;

//   float finalWave = wave;

//   finalWave -= 1.0 * length(bump.xyz);

//   vec3 displacedPosition = position + vec3(0.0, 0.0, finalWave);

//   vPosition = displacedPosition;

//   gl_Position = projectionMatrix * modelViewMatrix * vec4(displacedPosition, 1.0);
//   // 
//   // gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

// }

#pragma glslify: classic2d = require(glsl-noise/classic/2d)
#pragma glslify: classic3d = require(glsl-noise/classic/3d)
#pragma glslify: fbm = require(../fbmNoise)

void main() {
  vUv = uv;
  vOriginalPosition = position;

  vec2 centeredUvs = vUv - vec2(0.5);
  centeredUvs.x *= uResolution.x / uResolution.y;

  float perlinNoise2D = classic2d(centeredUvs * 7.0);
  float perlinNoise3D = classic3d(vec3(vec2(centeredUvs * 7.0), uTime * 0.5));
  float fbmNoiseBurn = fbm(vec3(centeredUvs * 7.0, uTime * 0.0), 8);
  float dist = length(centeredUvs)
    //  + perlinNoise3D * 0.05
  + fbmNoiseBurn * 0.2;

  float smoothStepThickness = 0.002;
  float radius = mix(0.0, 1.0, uProgress);
    // float radius = 0.2;
  float edgeWidthBurn = 0.003 + perlinNoise3D * 0.01;

  float circle1 = 1.0 - smoothstep(radius, radius + smoothStepThickness, dist);
  float circle2 = 1.0 - smoothstep(radius + edgeWidthBurn, radius + edgeWidthBurn + smoothStepThickness, dist);

  float cutout = circle2 - circle1;

  // vec3 colorDispersionBurn = vec3(0.2, 0.4, 1.7);
  // vec3 colorDispersionBurn = vec3(0.2, 0.7, 0.7);
  vec3 colorDispersionBurn = mix(vec3(25.0 / 255.0, 62.0 / 255.0, 74.0 / 255.0), vec3(0.2, 0.7, 0.7), uProgress);

  vec3 finalColorBurn = colorDispersionBurn * cutout;

  float pain = 1.0 - circle1;

  // float frequency = 0.8;
  float frequency = 0.5;
  float amplitude = 0.8;

  float distance = length(position.xy);

  vec4 bump = texture2D(uDoubleBufferTexture2, uv);

  // float wave = abs(amplitude * sin(sin(frequency * distance - uTime * 0.3) * (frequency * distance - uTime * 0.6)));
  float wave = abs(amplitude * sin(frequency * distance - uTime * 0.3));

  wave -= 0.4;

  float finalWave = wave;

  finalWave -= 1.0 * length(bump.xyz);

  vec3 displacedPosition = position + vec3(0.0, 0.0, finalWave);

  vec3 scaledPosition = position;
  // scaledPosition.

  vPosition = displacedPosition;

  // gl_Position = projectionMatrix * modelViewMatrix * vec4(displacedPosition, 1.0);
  // gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  //

  // vPosition = position;

  // // float valley = smoothstep(0.8, 0.75, abs(position.x * uProgress));
  // // float valley = abs(amplitude * sin(frequency * distance));

  float distanceValley = length(position.xy);
  // float valley = exp(-distance * mix(1.0, 0.2, uProgress)) * sin(distance * 5.0 - uTime * 5.0);

  float someProg = uProgress;

  // for low fov (20)
  // float valley = exp(-distance * -0.01) * 0.5 * sin(distance * 5.0 - uTime * 1.0);

  //for higher fov (default)
  float valley = exp(-distance * -0.01) * 0.5 * sin(distance * 2.0 - uTime * 1.0);
  // float valley = exp(-distance * -0.01) * sin(distance * 1.0 - uTime * 1.0 * clamp(mix(1.0, 0.0, someProg), 0.0, 1.0));
  // float valley = exp(-distance * 0.1) * 3.0 * sin(distance * 1.0 - uTime * 1.0);

  vec3 someOther = position.xyz;

  someOther.z += valley;

  float riseRadius = mix(0.0, 1.0, uProgress);

  vec3 newPositonn = position;

  newPositonn.x /= uWidth;
  newPositonn.y /= uHeight;

  newPositonn.x *= uResolution.x / uResolution.y;

  float fbmNoise2 = fbm(vec3(newPositonn.xy * 7.0, uTime * 0.0), 6);

  float riseDist = length(newPositonn.xy)
    //  + perlinNoise3D * 0.05
  + fbmNoise2 * 0.2;

  float rise = 1.0 - smoothstep(riseRadius, riseRadius + 0.15, riseDist);

  rise = -1.0 * rise;

  // someOther.z += rise;

  // someOther.z = max(someOther.z, rise);

  vPosition = someOther;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(someOther, 1.0);

  // gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

}