precision highp float;

varying vec2 vUv;

void main() {
    vUv = uv;

    vec4 worldPosition = instanceMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * modelViewMatrix * worldPosition;
}
