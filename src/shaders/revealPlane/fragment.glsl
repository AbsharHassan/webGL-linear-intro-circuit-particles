precision highp float;

varying vec2 vUv;

uniform vec2 uResolution;
uniform vec3 uMousePos;
uniform float uTime;
uniform sampler2D uScene;

void main() {
    // float aspectRatio = uResolution.x / uResolution.y;
    // vec2 p = vUv - vec2(0.5);
    // p.x *= aspectRatio;

    // vec3 color = vec3(0.0);

    // vec3 correctedMousePosition = uMousePos;
    // correctedMousePosition.x *= aspectRatio;

    // float d = step(0.1, length(p - correctedMousePosition.xy));
    // float something = 0.1 / d;

    // float d = step(0.3, length(centeredUvs - vec2(uMousePos.x, uMousePos.y)));
    // float d = length(centeredUvs - vec2(uMousePos.x, uMousePos.y));

    vec4 color = texture2D(uScene, vUv);

    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0 - color.a);
    // gl_FragColor = color;

}