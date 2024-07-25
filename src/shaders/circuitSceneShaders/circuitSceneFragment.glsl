precision highp float;

varying vec2 vUv;

uniform sampler2D uScene;
uniform vec2 uResolution;
uniform vec3 uMousePos;

void main() {
    vec2 cUV = vUv - vec2(0.5);
    cUV.x *= uResolution.x / uResolution.y;

    vec3 correctedMousePosition = uMousePos;
    correctedMousePosition.x *= uResolution.x / uResolution.y;

    vec2 colorOffset = normalize(cUV) * .003 * smoothstep(0.0, 0.3, length(cUV - correctedMousePosition.xy));

    float sceneTexelsRed = texture2D(uScene, vUv + colorOffset).r;
    float sceneTexelsGreen = texture2D(uScene, vUv).g;
    float sceneTexelsBlue = texture2D(uScene, vUv - colorOffset).b;

    vec3 finalColor = vec3(sceneTexelsRed, sceneTexelsGreen, sceneTexelsBlue);

    gl_FragColor = vec4(finalColor * 1.5, 1.0);
}