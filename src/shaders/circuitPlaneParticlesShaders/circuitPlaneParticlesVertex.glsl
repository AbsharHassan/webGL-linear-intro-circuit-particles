precision highp float;

attribute vec3 aPoint;

varying vec2 vUv;
varying vec3 vPoint;

void main() {
    vUv = uv;
    vPoint = aPoint;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}