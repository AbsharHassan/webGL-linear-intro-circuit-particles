precision highp float;

attribute vec3 aLinePosition;
varying vec3 vLinePosition;

varying vec2 vUv;

void main() {
    vLinePosition = aLinePosition;
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}