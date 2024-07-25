precision highp float;

attribute vec3 pos;
varying vec2 vUv;
uniform float uScale;

void main() {
    vUv = uv;

    vec3 particle_position = (modelMatrix * vec4(pos, 1.0)).xyz;
    vec4 view_pos = viewMatrix * vec4(particle_position, 1.0);

    vec4 scaledPosition = vec4(position * uScale, 1.0);

    view_pos.xyz += scaledPosition.xyz;

    gl_Position = projectionMatrix * view_pos;
}