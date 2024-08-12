precision highp float;

varying vec2 vUV;
varying float vOffsetValue;

uniform vec2 uResolution;
uniform float uProgression;
uniform float uTime;
uniform float uOffset;
uniform float uOnOrOff;

uint murmurHash12(uvec2 src) {
    const uint M = 0x5bd1e995u;
    uint h = 1190494759u;
    src *= M;
    src ^= src >> 24u;
    src *= M;
    h *= M;
    h ^= src.x;
    h *= M;
    h ^= src.y;
    h ^= h >> 13u;
    h *= M;
    h ^= h >> 15u;
    return h;
}
// 1 output, 2 inputs
float hash12(vec2 src) {
    uint h = murmurHash12(floatBitsToUint(src));
    return uintBitsToFloat(h & 0x007fffffu | 0x3f800000u) - 1.0;
}

float hash11(float x) {
    x = fract(sin(x) * 43758.5453123);
    return x;
}

#pragma glslify: cnoise = require('glsl-noise/classic/3d.glsl')

void main() {
    float aspectRatio = uResolution.x / uResolution.y;

    vec2 st = vUV;

    // st.x = 1.0 - st.x;
    st.y -= 0.5;

    // st.x *= aspectRatio;

    float ss1 = smoothstep(0.2, 0.0, abs(st.y));
    // float ss2 = 1.0 - step(uProgression, st.x);
    float ss2 = 1.0 - step(1.0, st.x);

    float beam = ss1 * ss2;

    float randomNumber = hash12(st);

    float noise = cnoise(vec3(st, uTime));

    // float l1 = length(vec2(st.x - hash11(5.34), st.y));
    // float l1 = length(vec2(st.x - uOffset, st.y));

    // float progress = sin(uTime);
    float progress = fract(uTime * 0.2 + uOffset);
    float l1 = length(vec2((st.x - progress) * 0.5, st.y * 0.2));
    // float l1 = length(vec2(st.x - 0.5 * sin(noise), st.y));

    float onOrOff = 0.0;

    if(uOnOrOff > 0.75) {
        onOrOff = 1.0;
    }

    float d1 = smoothstep(0.1, 0.0, l1) * onOrOff;

    float pulse = smoothstep(-1.0, 1.0, sin(vUV.x * 10.0 + uTime));

    // float final = beam + d1 * 0.3;
    float final = beam;

    gl_FragColor = vec4(d1, 0.0, 0.3, 1.0);
    // gl_FragColor = vec4(1.0, 1.0, 1.0, final);
}
