precision highp float;

varying vec2 vUV;

uniform vec2 uResolution;
uniform float uProgression;
uniform float uTime;

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

#pragma glslify: cnoise = require('glsl-noise/classic/3d.glsl')

void main() {
    float aspectRatio = uResolution.x / uResolution.y;

    vec2 st = vUV;

    // st.x = 1.0 - st.x;
    st.y -= 0.5;

    // st.x *= aspectRatio;

    float ss1 = smoothstep(0.5, 0.0, abs(st.y));
    // float ss2 = 1.0 - step(uProgression, st.x);
    float ss2 = 1.0 - step(1.0, st.x);

    float beam = ss1 * ss2;

    float randomNumber = hash12(st);

    float noise = cnoise(vec3(st, uTime));

    float l1 = length(vec2(st.x - noise, st.y));
    float d1 = smoothstep(0.6, 0.0, l1);

    gl_FragColor = vec4(d1, 0.0, 0.3, 1.0);
}
