varying vec2 vUV;

uniform float uOpacityVal;

void main() {
    vec2 newUv = vUV;

    vec2 flippedUV = vec2(vUV.x, 1.0 - vUV.y);

    flippedUV.y -= 0.5;

    float grad1 = smoothstep(0.5, 0.0, flippedUV.y);

    float grad2 = smoothstep(-0.5, -0.0, flippedUV.y);

    gl_FragColor = vec4(flippedUV, 0.0, grad1 * grad2);
    // gl_FragColor = vec4(flippedUV, 0.0, 1.0);
}