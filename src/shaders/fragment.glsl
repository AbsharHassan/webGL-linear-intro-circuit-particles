precision highp float;

varying vec2 vUv;

uniform vec2 uResolution;
uniform vec3 uMousePos;
uniform float uTime;
uniform sampler2D uScene;

float Hash21(vec2 p) {
    p = fract(p * vec2(234.34, 435.345));
    p += dot(p, p + 34.23);
    return fract(p.x * p.y);
}

void main() {
    float aspectRatio = uResolution.x / uResolution.y;
    vec2 newUvs = vUv - vec2(0.5);

    newUvs.x *= aspectRatio;

    vec3 correctedMousePosition = uMousePos;
    correctedMousePosition.x *= aspectRatio;

    float d = length(newUvs - correctedMousePosition.xy);
    float m = 0.01 / (d);

    // vec2 someVec = vec2(0.5, 0.0);
    // someVec.x *= aspectRatio;

    // float d = 0.1 / length(vec2(correctedMousePosition.x, correctedMousePosition.y) - newUvs);
    // float d = 0.1 / length(someVec - newUvs);

    gl_FragColor = vec4(m, 0.0, 0.0, 1.0);
}

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

    // vec2 newUvs = vUv;

    // vec2 flippedUV = vec2(vUv.x, 1.0 - vUv.y);

    // newUvs -= 0.5;

    // float grad1 = smoothstep(0.5, 0.1, newUvs.y);

    // float grad2 = smoothstep(-0.5, -0.1, newUvs.y);

    // gl_FragColor = vec4(newUvs, 0.0, grad1 * grad2);

    // vec2 uv = gl_FragCoord.xy / uResolution.xy;

    // vec4 somePain = texture2D(uScene, vUv);

    // gl_FragColor = somePain;
