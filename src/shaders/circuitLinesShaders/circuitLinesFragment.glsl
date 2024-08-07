precision highp float;

varying vec2 vUV;

uniform vec2 uResolution;
uniform float uProgression;

void main() {
    float aspectRatio = uResolution.x / uResolution.y;

    vec2 st = vUV;

    // st.x = 1.0 - st.x;
    st.y -= 0.5;

    st.x *= aspectRatio;

    float ss1 = smoothstep(0.5, 0.0, abs(st.y));
    // float ss2 = 1.0 - step(uProgression, st.x);
    float ss2 = 1.0 - step(1.0, st.x);

    float beam = ss1 * ss2;

    float l1 = length(vec2(st.x - 4.6, st.y));
    float l2 = length(vec2(st.x - 8.6, st.y));
    float l3 = length(vec2(st.x - 6.6, st.y));
    float l4 = length(vec2(st.x - 2.5, st.y));
    float l5 = length(vec2(st.x - 1.6, st.y));
    float l6 = length(vec2(st.x - 0.3, st.y));
    float l7 = length(vec2(st.x - 150.6, st.y));

    float dTest = 0.1 / length(vUV);

    float d1 = 0.1 / pow(l1, 1.0);
    float d2 = 0.1 / pow(l2, 1.0);
    float d3 = 0.1 / pow(l3, 1.0);
    float d4 = 0.1 / pow(l4, 1.0);
    float d5 = 0.1 / pow(l5, 1.0);
    float d6 = 0.1 / pow(l6, 1.0);
    float d7 = 0.1 / pow(l7, 1.0);

    // float d1 = smoothstep(0.6, 0.0, l1);
    // float d2 = smoothstep(0.6, 0.0, l2);
    // float d3 = smoothstep(0.6, 0.0, l3);
    // float d4 = smoothstep(0.6, 0.0, l4);
    // float d5 = smoothstep(0.6, 0.0, l5);
    // float d6 = smoothstep(0.6, 0.0, l6);
    // float d7 = smoothstep(0.6, 0.0, l7);

    float allParticles = d1 + d2 + d3 + d4 + d5 + d6 + d7;

    // gl_FragColor = vec4(beam, 0.0, 0.0, 1.0);
    // gl_FragColor = vec4(uProgression, 0.0, 0.0, beam);
    gl_FragColor = vec4(allParticles, 0.2, 0.0, 1.0);
}
