precision highp float;

varying vec2 vUv;

uniform vec2 uResolution;
uniform float uProgression;

float hash(vec2 p) {
    p = 50.0 * fract(p * 0.3183099 + vec2(0.71, 0.113));
    return fract(p.x * p.y * (p.x + p.y));
}

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

void main() {
    vec2 cUv = vUv - vec2(0.5);
    // cUv.y -= 0.5;
    cUv.x *= uResolution.x / uResolution.y;

    float asp = uResolution.x / uResolution.y;

    float l1 = length(vec2(cUv.x * 0.5, cUv.y));

    float d1 = smoothstep(0.6, 0.0, l1);

    float allParticles = d1;

    float ss1 = smoothstep(0.1, 0.0, abs(cUv.y));
    // float ss2 = 1.0 - smoothstep(0.0, 1.0 * uResolution.x, vUv.x);
    float ss2 = 1.0 - step(uProgression, vUv.x);
    // float ss2 = 1.0 - smoothstep(0.0, .3, vUv.x * vUv.x * vUv.x);

    float beam = ss1 * ss2;

    float randNum = hash12(vUv); 

    // gl_FragColor = vec4(1.0, 0.0, 0.0, allParticles);
    gl_FragColor = vec4(vec3(randNum), 1.0);
}
