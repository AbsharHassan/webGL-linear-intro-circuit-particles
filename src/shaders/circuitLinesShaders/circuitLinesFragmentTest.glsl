precision highp float;

varying vec2 vUv;

uniform vec2 uResolution;
uniform float uProgression;

void main() {
    vec2 cUv = vUv - vec2(0.5);
    // cUv.y -= 0.5;
    cUv.x *= uResolution.x / uResolution.y;

    float asp = uResolution.x / uResolution.y;

    float d = 0.1 / length(cUv);

    float ss1 = smoothstep(0.1, 0.0, abs(cUv.y));
    // float ss2 = 1.0 - smoothstep(0.0, 1.0 * uResolution.x, vUv.x);
    float ss2 = 1.0 - step(uProgression, vUv.x);
    // float ss2 = 1.0 - smoothstep(0.0, .3, vUv.x * vUv.x * vUv.x);

    float beam = ss1 * ss2;

    gl_FragColor = vec4(beam, 0.0, 0.0, 1.0);
}
