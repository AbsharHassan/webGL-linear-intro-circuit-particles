precision highp float;

varying vec2 vUv;
varying vec3 vPoint;

uniform vec2 uResolution;
uniform float uProgression;

void main() {
    vec2 cUv = vUv - vec2(0.5);
    cUv.x *= uResolution.x / uResolution.y;

    float distance = length(cUv.xy - vPoint.xy);

    float m = 0.1 / distance;

    gl_FragColor = vec4(m, 0.0, 0.0, 1.0);
}
