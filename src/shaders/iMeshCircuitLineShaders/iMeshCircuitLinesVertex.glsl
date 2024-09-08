precision highp float;

attribute float aIsPulseOn;
attribute float aPulseOffset;
attribute float aPulseDirection;

varying vec2 vUv;
varying float vIsPulseOn;
varying float vPulseOffset;
varying float vPulseDirection;

void main() {
    vUv = uv;
    vIsPulseOn = aIsPulseOn;
    vPulseOffset = aPulseOffset;
    vPulseDirection = aPulseDirection;

    vec4 worldPosition = instanceMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * modelViewMatrix * worldPosition;
}
