precision highp float;

varying vec2 vUv;

uniform vec2 uResolution;
uniform vec3 uMousePos;
uniform float uTime;
uniform sampler2D uScene;
uniform sampler2D uScene2;

uniform float uEdge1;

#pragma glslify: cnoise = require('glsl-noise/classic/3d.glsl')
#pragma glslify: snoise = require('glsl-noise/simplex/3d.glsl')

float Hash21(vec2 p) {
    p = fract(p * vec2(234.34, 435.345));
    p += dot(p, p + 34.23);
    return fract(p.x * p.y);
}

vec2 Hash22(vec2 p) {
    float n = Hash21(p);
    return vec2(n, Hash21(p + n));
}

vec3 addSingleLine(vec2 uv) {
    vec3 lightBlue = vec3(71.0 / 255.0, 131.0 / 255.0, 251.0 / 255.0);
    vec3 darkBlue = vec3(0.0 / 255.0, 59.0 / 255.0, 158.0 / 255.0);

    vec3 red = vec3(1.0, 0.0, 0.0);
    vec3 green = vec3(0.0, 1.0, 0.0);

    float mixer = smoothstep(0.7, 1.2, abs(cos(uv.x * 1.0)));
    vec3 color = mix(darkBlue, lightBlue, mixer);
    return color;
}

vec3 addLines(vec2 uv) {
    float noise = cnoise(vec3(uv, uTime));

    uv *= 
    // noise *
    10.0;

    vec3 black = vec3(0.1, 0.1, 0.1);
    float finalMixer = abs(cos(uv.x * 1.0));
    vec3 singleLine = addSingleLine(uv);
    vec3 color = mix(black, singleLine, finalMixer);
    return color;
}

void main() {
    float aspectRatio = uResolution.x / uResolution.y;
    vec2 aspectCorrectedUvs = vUv - vec2(0.5);
    aspectCorrectedUvs.x *= aspectRatio;

    float scale = 2.75;

    // aspectCorrectedUvs += 0.1 * cos(scale * 0.2 * 3.0 * aspectCorrectedUvs.yx + 0.5 * Hash21(vec2(1.2, cnoise(vec3(vUv, uTime)))) * uTime + vec2(1.2, 3.4));
    // aspectCorrectedUvs += 0.1 * cos(scale * 0.31 * 3.0 * aspectCorrectedUvs.yx + 1.4 * uTime + vec2(2.2, 3.4));
    // aspectCorrectedUvs += 0.1 * cos(scale * 0.7 * 3.0 * aspectCorrectedUvs.yx + 2.6 * uTime + vec2(4.2, 1.4));
    // aspectCorrectedUvs += 0.1 * cos(scale * 1.3 * 3.0 * aspectCorrectedUvs.yx + 3.7 * uTime + vec2(10.2, 3.4));

    vec3 someCol = addLines(aspectCorrectedUvs + cnoise(vec3(vUv, uTime * 0.5) * 2.0 + 2.0));
    vec4 colorMain = vec4(someCol, 1.0);

    // vec4 colorTexure = texture2D(uScene, vUv + 0.5 * cnoise(vec3(vUv, uTime * 0.5)));
    vec4 colorTexure = texture2D(uScene, vUv);

    vec3 correctedMousePosition = uMousePos;
    correctedMousePosition.x *= aspectRatio;

    float d = length(aspectCorrectedUvs - correctedMousePosition.xy);
    float m = 0.1 / (d);

    float opacityVal = mix(1.0, 1.0 - colorTexure.a, m);

    vec4 painColor = texture2D(uScene2, vUv);

    float alphaMainCol = 1.0 - painColor.a;

    // colorMain.a = painColor.a;

    vec4 finCol = mix(colorMain, painColor, painColor.r);

    // gl_FragColor = vec4(vec3(colorMain.x * 1.0, colorMain.y * 1.0, colorMain.z * 1.0), 1.0 - colorTexure.a); 
    gl_FragColor = vec4(finCol);
    // gl_FragColor = vec4(m, 0.0, 0.0, 1.0);

    // gl_FragColor = painColor;

}