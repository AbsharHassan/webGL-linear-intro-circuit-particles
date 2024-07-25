precision highp float;

varying vec2 vUv;

uniform sampler2D uScene;
uniform sampler2D uPrev;

void main() {
    vec3 currentColor = texture2D(uScene, vUv).rgb;

    vec3 prevColor = texture2D(uPrev, vUv).rgb;

    vec3 bgColor = vec3(1.0, 1.0, 1.0);

    vec3 joinedColor = currentColor + 1.0 * prevColor;

    vec3 finalColor = joinedColor * (1.0 - 0.01);
    finalColor -= 0.01;

    gl_FragColor = vec4(min(bgColor, finalColor), 1.0);
}
