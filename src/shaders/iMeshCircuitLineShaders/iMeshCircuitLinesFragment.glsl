precision highp float;

varying vec2 vUv;
varying float vIsPulseOn;
varying float vPulseOffset;
varying float vPulseDirection;

uniform float uTime;

void main() {
    vec2 st = vUv;
    st.y -= 0.5;

    float ss1 = smoothstep(0.2, 0.0, abs(st.y));
    float ss2 = 1.0 - step(1.0, st.x);
    float beam = ss1 * ss2;

    float progress = fract(uTime * 0.4 - vPulseOffset);
    float pulseThickness = 10.0;
    float pulseWidth = 1.0;

    vec2 pulseCenter = vec2((st.x - progress) * 1.0 / pulseWidth, st.y * 1.0 / pulseThickness);

    if(vPulseDirection == 1.0) {
        pulseCenter = vec2((1.0 / pulseWidth), 0.0) - vec2((st.x + progress) * 1.0 / pulseWidth, st.y * 1.0 / pulseThickness);
    }

    float pulse = smoothstep(0.1, 0.0, length(pulseCenter));

    float smoothedEnds = smoothstep(1.0, 0.8, st.x);
    smoothedEnds -= smoothstep(0.2, 0.0, st.x);

    pulse = pulse * smoothedEnds;

    float finalCol = beam;

    if(vIsPulseOn == 1.0) {
        finalCol += pulse;
    }

    gl_FragColor = vec4(finalCol, 0.0, 0.8, 1.0);

}