precision highp float;

varying vec2 vUv;

uniform vec2 uResolution;
uniform vec3 uMousePos;
uniform float uTime;

#pragma glslify: cnoise = require('glsl-noise/classic/3d.glsl')
#pragma glslify: snoise = require('glsl-noise/simplex/3d.glsl')

float Hash21(vec2 p) {
    p = fract(p * vec2(234.34, 435.345));
    p += dot(p, p + 34.23);
    return fract(p.x * p.y);
}

vec2 Hash22(vec2 p) {
    float n = Hash21(p);
    return vec2(n, Hash21(p + n));
}

void main() {
    float aspectRatio = uResolution.x / uResolution.y;
    vec2 aspectCorrectedUvs = vUv - vec2(0.5);
    aspectCorrectedUvs.x *= aspectRatio;

    vec3 col = vec3(1.0, 0.0, 0.0);

    float m = 0.1 / length(aspectCorrectedUvs);

    gl_FragColor = vec4(m, 0.0, 0.0, 1.0);
}