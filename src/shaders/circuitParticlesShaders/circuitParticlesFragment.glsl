precision highp float;

varying vec2 vUv;
varying float vOpacity;

void main() {
    vec2 cUv = vUv - 0.5;

    // vec3 blueColor = vec3(4.0 / 255.0, 10.0 / 255.0, 20.0 / 255.0);
    vec3 blueColor = vec3(20.0 / 255.0, 4.0 / 255.0, 4.0 / 255.0);

    vec4 finalColor = vec4(0.08 / length(cUv));
    finalColor.rgb = min(vec3(10.0), finalColor.rgb);

    finalColor.rgb *= blueColor * 120.0;

    finalColor *= vOpacity;

    finalColor.a = min(1.0, finalColor.a) * 10.0;

    gl_FragColor = vec4(finalColor);

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    float circle = 0.2 / length(cUv);

    gl_FragColor = vec4(circle, 0.0, 0.0, circle) * circle;
}