precision highp float;

varying vec2 vUV;
uniform float uProgression;

void main() {
    vec2 st = vUV;

    st.x = 1.0 - st.x;
    st.y -= 0.5;

    float ss1 = smoothstep(0.3, 0.0, abs(st.y));
    float ss2 = 1.0 - step(uProgression, st.x);

    float beam = ss1 * ss2;

    gl_FragColor = vec4(1.0, 0.0, 0.0, beam);
}
