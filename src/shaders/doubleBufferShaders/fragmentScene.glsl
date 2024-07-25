precision highp float;

varying vec2 vUv;

uniform vec2 uResolution;
uniform vec3 uMousePos;
uniform float uPortalRadius;
uniform float uScale;
uniform float uThicknessScale;
uniform float uVelocityScale;

void main() {
    float aspectRatio = uResolution.x / uResolution.y;

    vec2 aspectCorrectedUVs = vUv - vec2(0.5);

    aspectCorrectedUVs.x *= aspectRatio;

    vec3 correctedMousePosition = uMousePos;
    correctedMousePosition.x *= aspectRatio;

    float d = length(aspectCorrectedUVs - correctedMousePosition.xy);

    float r = 0.25 * uPortalRadius * clamp(uVelocityScale, 0.0, 1.0);

    float auto = smoothstep(r, r - 0.5 * uThicknessScale, d) * uScale;

    gl_FragColor = vec4(vec3(auto), 1.0);
}
