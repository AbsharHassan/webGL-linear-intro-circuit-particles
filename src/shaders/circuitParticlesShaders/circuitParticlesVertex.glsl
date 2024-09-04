precision highp float;

attribute vec3 pos;
attribute float aOpacity;

varying float vOpacity;
varying vec2 vUv;

void main() {
    vUv = uv;
    vOpacity = aOpacity;

    vec4 worldPosition = instanceMatrix * vec4(position * 1.0, 1.0);
    gl_Position = projectionMatrix * modelViewMatrix * worldPosition;
}

// void main() {
//     vUv = uv;

//     vOpacity = aOpacity;

//     // // vec3 newPosition = position + aPos;

//     // // vec4 mvPosition = viewMatrix * vec4(position, 1.0);

//     // gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

//     vec3 particle_position = (modelMatrix * vec4(pos, 1.0)).xyz;

//     vec4 view_pos = viewMatrix * vec4(particle_position, 1.0);

//     view_pos.xyz += position * 5.0;

//     gl_Position = projectionMatrix * view_pos;

// }

precision highp float;

// attribute vec3 pos;
// // attribute mat4 instanceMatrix;

// varying vec2 vUv;

// void main() {
//     vUv = uv;

//     vec4 worldPosition = instanceMatrix * vec4(position, 1.0);
//     gl_Position = projectionMatrix * modelViewMatrix * worldPosition;
// }