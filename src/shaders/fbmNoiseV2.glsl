float randFBM(vec2 n) {
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noiseFBM(vec2 p) {
    vec2 ip = floor(p);
    vec2 u = fract(p);
    u = u * u * (3.0 - 2.0 * u);

    float res = mix(mix(randFBM(ip), randFBM(ip + vec2(1.0, 0.0)), u.x), mix(randFBM(ip + vec2(0.0, 1.0)), randFBM(ip + vec2(1.0, 1.0)), u.x), u.y);
    return res * res * res;
}

const mat2 mtx = mat2(0.80, 0.8, -0.8, 0.80);

float fbm(vec2 p) {
    float f = 0.0;

    f += 0.500000 * noiseFBM(p);
    p = mtx * p * 2.02;
    f += 0.031250 * noiseFBM(p);
    p = mtx * p * 2.01;
    f += 0.250000 * noiseFBM(p);
    p = mtx * p * 2.03;
    f += 0.125000 * noiseFBM(p);
    p = mtx * p * 2.01;
    f += 0.062500 * noiseFBM(p);
    p = mtx * p * 2.04;
    f += 0.015625 * noiseFBM(p);

    return f / 0.96875;
}

float baseWarpFbmNoise(in vec2 p) {
    return fbm(p + fbm(p + fbm(p)));
}

#pragma glslify: export(baseWarpFbmNoise)
