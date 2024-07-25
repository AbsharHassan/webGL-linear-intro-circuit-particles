precision highp float;

varying vec3 vLinePosition;
varying vec2 vUv;

uniform vec2 uResolution;
uniform sampler2D uLineScene;
uniform vec3 uMousePos;
// uniform float uTime;

void main() {
    // Coordinates around the current fragment
    // float thickness = 0.005; // Increase or decrease for more or less thickness
    // vec3 color = texture2D(uLineScene, vUv).rgb;

    // // Sample nearby pixels
    // for(float x = -5.0; x <= 5.0; x++) {
    //     for(float y = -5.0; y <= 5.0; y++) {
    //         vec2 offset = vec2(x, y) * thickness;
    //         color += texture2D(uLineScene, vUv + offset).rgb;
    //     }
    // }

    // color /= 9.0; // Average the colors of the 9 sampled points
    // vec2 scaledUvs = vUv * 0.5;

    // vec4 color = texture2D(uLineScene, scaledUvs + 0.25);

    // float something = smoothstep(0.01, 0.02, color.r);
    // gl_FragColor = vec4(vec3(something), 1.0);
    // gl_FragColor = vec4(color.rgb, 1.0);

    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = vUv;

    vec2 lastUv = vec2(uMousePos.x / uResolution.x, uMousePos.y / uResolution.y);

    if(uMousePos.w > .9) {
        if(uv.x < lastUv.x + .03 && uv.x > lastUv.x - .03)
            if(uv.y < lastUv.y + .05 && uv.y > lastUv.y - .05)
                gl_FragColor = vec4(1. - uMousePos.x / uResolution.x, uMousePos.x / uResolution.x, 1. - uMousePos.y / uResolution.y, 0);
    } else
        gl_FragColor = vec4(0, 0, 0, 0);
}