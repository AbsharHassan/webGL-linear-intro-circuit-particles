precision highp float;

varying vec2 vUv;

uniform vec2 uResolution;
uniform float uProgression;

void main() {
    vec2 cUv = vUv - vec2(0.5);
    // cUv.y -= 0.5;
    cUv.x *= uResolution.x / uResolution.y;

    float asp = uResolution.x / uResolution.y;

    float l1 = length(vec2(cUv.x + 1.6, cUv.y));
    float l2 = length(vec2(cUv.x + 3.6, cUv.y));
    float l3 = length(vec2(cUv.x + 0.6, cUv.y));
    float l4 = length(vec2(cUv.x + 2.5, cUv.y));
    float l5 = length(vec2(cUv.x - 1.6, cUv.y));
    float l6 = length(vec2(cUv.x - 0.3, cUv.y));
    float l7 = length(vec2(cUv.x - 2.6, cUv.y));

    // float d1 = 0.1 / pow(l1, 1.0);
    // float d2 = 0.1 / pow(l2, 1.0);
    // float d3 = 0.1 / pow(l3, 1.0);
    // float d4 = 0.1 / pow(l4, 1.0);
    // float d5 = 0.1 / pow(l5, 1.0);
    // float d6 = 0.1 / pow(l6, 1.0);
    // float d7 = 0.1 / pow(l7, 1.0);

    float d1 = smoothstep(0.6, 0.0, l1);
    float d2 = smoothstep(0.6, 0.0, l2);
    float d3 = smoothstep(0.6, 0.0, l3);
    float d4 = smoothstep(0.6, 0.0, l4);
    float d5 = smoothstep(0.6, 0.0, l5);
    float d6 = smoothstep(0.6, 0.0, l6);
    float d7 = smoothstep(0.6, 0.0, l7);

    float allParticles = d1 + d2 + d3 + d4 + d5 + d6 + d7;

    float ss1 = smoothstep(0.1, 0.0, abs(cUv.y));
    // float ss2 = 1.0 - smoothstep(0.0, 1.0 * uResolution.x, vUv.x);
    float ss2 = 1.0 - step(uProgression, vUv.x);
    // float ss2 = 1.0 - smoothstep(0.0, .3, vUv.x * vUv.x * vUv.x);

    float beam = ss1 * ss2;

    gl_FragColor = vec4(1.0, 0.0, 0.0, allParticles);
}
