// precision highp float;

// varying vec2 vUv;

// uniform vec2 uResolution;
// uniform vec3 uMousePos;
// uniform float uTime;
// uniform sampler2D uScene;
// uniform float uProgress;

// #pragma glslify: fbm = require(../fbmNoise)

// void main() {
//     vec2 cUV = vUv - vec2(0.5);
//     cUV.x *= uResolution.x / uResolution.y;

//     float fbmNoise = fbm(vec3(vUv * 7.0, uTime * 0.0), 4);
//     float edgeWidth = 0.01;

//     float someProgress = abs(sin(uTime * 0.1));

//     float disperse = 1.0 - smoothstep(0.0, edgeWidth * 0.5, abs(someProgress - fbmNoise - edgeWidth * 0.5));

//     vec3 colorDispersion = vec3(0.2, 0.4, 0.7);

//     vec3 finalColor = disperse * colorDispersion;

//     gl_FragColor = vec4(finalColor, 1.0);

//     // float radius1 = uProgress;
//     // float radius2 = uProgress + 0.15;

//     // float innerCircle = 1.0 - smoothstep(radius1, radius1 + 0.15, length(cUV));

//     // float noiseMixer = smoothstep(radius2, radius2 + 0.30, length(cUV));
//     // float mixedNoise = mix(fbmNoise, 1.0, noiseMixer);

//     // float finalCol = mixedNoise - innerCircle;

//     // gl_FragColor = vec4(vec3(fbmNoise), 1.0);

// }

precision highp float;

uniform vec2 uResolution;
varying vec2 vUv;
uniform float uTime;
uniform float uProgress;

#pragma glslify: classic2d = require(glsl-noise/classic/2d)
#pragma glslify: classic3d = require(glsl-noise/classic/3d)
#pragma glslify: fbm = require(../fbmNoise)

void main() {
    vec2 cUV = vUv - vec2(0.5);
    cUV.x *= uResolution.x / uResolution.y;

    float perlinNoise2D = classic2d(cUV * 7.0);
    float perlinNoise3D = classic3d(vec3(vec2(cUV * 7.0), uTime * 0.5));
    float fbmNoise = fbm(vec3(cUV * 7.0, uTime * 0.0), 8);

    float dist = length(cUV)
    //  + perlinNoise3D * 0.05
    + fbmNoise * 0.2;

    float smoothStepThickness = 0.002;
    float radius = mix(0.0, 1.0, uProgress);
    // float radius = 0.2;
    float edgeWidth = 0.005 + perlinNoise3D * 0.01;

    float circle1 = 1.0 - smoothstep(radius, radius + smoothStepThickness, dist);
    float circle2 = 1.0 - smoothstep(radius + edgeWidth, radius + edgeWidth + smoothStepThickness, dist);

    float cutout = circle2 - circle1;

    vec3 colorDispersion = vec3(0.2, 0.4, 0.7);

    vec3 finalColor = colorDispersion * cutout;

    gl_FragColor = vec4(finalColor, 1.0);
}
