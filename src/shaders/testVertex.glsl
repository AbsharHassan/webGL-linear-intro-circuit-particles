precision highp float;

attribute vec3 pos;

varying vec2 vUv;

void main() {
    vUv = uv;

    vec3 item_position = (modelMatrix * vec4(pos + position, 1.0)).xyz;

    vec4 view_pos = viewMatrix * vec4(item_position, 1.0);

    // view_pos.xyz += position * 1.0;

    gl_Position = projectionMatrix * view_pos;

}