precision highp float;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vOriginalPosition;

uniform vec2 uResolution;
uniform float uTime;
uniform float uProgress;
uniform int uOctaves;

uniform sampler2D uDoubleBufferTexture;
uniform sampler2D uDoubleBufferTexture2;

#pragma glslify: classic2d = require(glsl-noise/classic/2d)
#pragma glslify: classic3d = require(glsl-noise/classic/3d)
#pragma glslify: fbm = require(../fbmNoise)

mat2 rotate(float rad) {
  float c = cos(rad);
  float s = sin(rad);
  return mat2(c, -s, s, c);
}

float addDiagonals(vec2 uv, float circle) {
  vec2 scaledUv = uv * 50.0;
  vec2 gUv = fract(scaledUv) - 0.5;

  float perlinNoise2D = classic2d(scaledUv * 7.0);
  float perlinNoise3D = classic3d(vec3(vec2(scaledUv * 7.0), uTime * 0.5)) * circle;

  // gUv += perlinNoise3D * 0.2;

  gUv = gUv * rotate(perlinNoise3D);

  // gUv = gUv * rotate(sin(uTime * 1.0));

  // float line = abs(gUv.x - direction * gUv.y);
  float lineRightEquation = abs(gUv.x - gUv.y);
  float lineLeftEquation = abs(gUv.x + gUv.y);

  float edgeWidth = 0.01; // Smaller value for sharper transition
  float thickness = 0.02;  // Thickness of the line

  float scale = 0.05;
  scale = 0.1;
  // scale = 0.4;

  // scale = 0.0;

  float lineRight = scale * (smoothstep(thickness + edgeWidth, thickness, lineRightEquation 
  //
  // + (perlinNoise3D * 0.2)
  //
  ));
  float lineLeft = scale * (smoothstep(thickness + edgeWidth, thickness, lineLeftEquation 
  //
  // + (perlinNoise3D * 0.2)
  //
  ));

  float line = lineLeft + lineRight;

  // return scale * (smoothstep(thickness + edgeWidth, thickness, lineRight));
  return line;
}

float addBoxes(vec2 uv, float circle) {
  // vec2 scaledUv = uv * mix(50.0, 75.0, abs(uv.x));
  vec2 scaledUv = uv * 50.0;

  // scaledUv = scaledUv * rot * 0.001;

  vec2 gUv = fract(scaledUv) - 0.5;

  float perlinNoise2D = classic2d(scaledUv * 7.0);
  float perlinNoise3D = classic3d(vec3(vec2(scaledUv * 7.0), uTime * 0.5)) * circle;

  gUv += perlinNoise3D * 0.2;
  // gUv = gUv * rot;

  // gUv = gUv * rotate(mix(-0.2, 0.2, sin(uTime * 0.2)));
  // gUv = gUv * rotate(perlinNoise3D);

  float left = -0.5 
  // + abs(perlinNoise2D) * 0.1
  ;
  float right = 0.5 
  // + abs(perlinNoise2D) * 0.1
  ;
  float top = 0.5 
  // + abs(perlinNoise2D) * 0.1
  ;
  float bottom = -0.5 
  // + abs(perlinNoise2D) * 0.1
  ;

  // float thickness = 0.05 + perlinNoise3D * 0.2;
  float thickness = 0.05;

  float lineX1 = smoothstep(left + thickness, left, gUv.x) - smoothstep(right - thickness, right, gUv.x);
  float lineY1 = smoothstep(bottom + thickness, bottom, gUv.y) - smoothstep(top - thickness, top, gUv.y);

  float lineX2 = smoothstep(right - thickness, right, gUv.x) - smoothstep(left + thickness, left, gUv.x);
  float lineY2 = smoothstep(top - thickness, top, gUv.y) - smoothstep(bottom + thickness, bottom, gUv.y);

  float scale = 0.10;
  // scale = 0.4;
  // scale = 0.0;
  // scale = something;

  return scale * (max(lineX1, lineX2) + max(lineY1, lineY2));
}

void main() {
  vec2 uv = vUv;
  uv.x *= uResolution.x / uResolution.y;

  vec2 centeredUvs = vUv - vec2(0.5);
  centeredUvs.x *= uResolution.x / uResolution.y;

  // float heightR = abs(0.8 * (sin(6.67 * length(centeredUvs) - uTime * 0.3))) - 0.1;
  // float heightB = abs(1.8 * (sin(13.3333 * length(centeredUvs) - uTime * 0.3))) + 0.5;
  float heightR = (vPosition.z - vOriginalPosition.z) - 0.5;
  float heightB = (vPosition.z - vOriginalPosition.z) - 0.2;

  // float diagonals = addDiagonals(uv, -1.0);
  // diagonals += addDiagonals(uv, 1.0);

  // // float straightLines = mix(0.05, addBoxes(uv), smoothstep(0.1, 0.5, vPosition.z));
  // // float finalDiagonals = diagonals * 1.8;

  // float straightLines = addBoxes(uv);
  // float finalDiagonals = mix(0.05, diagonals, heightB);
  // // float finalDiagonals = mix(0.05, diagonals, smoothstep(0.1, 0.5, vPosition.z));

  // float grid = finalDiagonals + straightLines;

  // vec3 colorGridLines = vec3(1.0, 1.0, 1.0);
  // vec3 finalGrid = colorGridLines * grid;
  // finalGrid.r *= heightR;
  // // finalGrid.b += smoothstep(0.1, 0.5, vPosition.z);
  // // finalGrid = vec3(heightR, 0.0, 0.0);

  // vec4 doubleBufferColor = texture2D(uDoubleBufferTexture, vUv);

  // vec4 transparent = vec4(vPosition.z, 0.0, 0.0, 0.0);

  // vec4 gridAndMouseTexels = mix(vec4(finalGrid, 1.0), transparent, length(doubleBufferColor.rgb));

  // gl_FragColor = gridAndMouseTexels;

  // expanding multiple burn holes effect
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // float fbmNoise1 = fbm(vec3(centeredUvs * 11.0, uTime * 0.10), uOctaves);
  // // float edgeWidth = mix(0.001, 0.1, uProgress);
  // float edgeWidth = 0.01;
  // float disperse = 1.0 - smoothstep(0.0, edgeWidth * 0.5, abs(uProgress - fbmNoise1 - edgeWidth * 0.5));
  // vec4 colorDispersion = mix(vec4(25.0 / 255.0, 62.0 / 255.0, 74.0 / 255.0, 1.0), vec4(0.2, 0.7, 0.7, 1.0), uProgress);
  // // vec4 colorDispersion = vec4(0.2, 0.4, 0.7, 1.0);
  // vec4 finalColor1 = disperse * colorDispersion;
  // vec4 finalTexels = mix(vec4(0.0) - uProgress, gridAndMouseTexels, smoothstep(uProgress - edgeWidth, uProgress, fbmNoise1));
  // finalTexels += finalColor1;
  // gl_FragColor = finalTexels;

  //outward burn effect
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // float perlinNoise2D = classic2d(centeredUvs * 7.0);
  // float perlinNoise3D = classic3d(vec3(vec2(centeredUvs * 7.0), uTime * 0.5));
  // float fbmNoise2 = fbm(vec3(centeredUvs * 7.0, uTime * 0.0), 8);
  // float dist = length(centeredUvs)
  //   //  + perlinNoise3D * 0.05
  // + fbmNoise2 * 0.2;
  // float smoothStepThickness = 0.002;
  // float radius = mix(0.0, 1.0, uProgress);
  // float edgeWidthBurn = 0.003 + abs(perlinNoise3D * 0.01);
  // float fadeThickness = 0.1;
  // float circle1 = 1.0 - smoothstep(radius, radius + smoothStepThickness, dist);
  // float circle2 = 1.0 - smoothstep(radius + edgeWidthBurn, radius + edgeWidthBurn + smoothStepThickness, dist);
  // float circle3 = 1.0 - smoothstep(radius, radius + smoothStepThickness + fadeThickness, dist);
  // float cutout = circle2 - circle1;
  // float fadeOutScale = 1.0 - circle3;
  // vec4 outputWithBurn = gridAndMouseTexels;
  // outputWithBurn.rgb *= fadeOutScale; 
  // // vec3 colorDispersionBurn = vec3(0.2, 0.4, 1.7);
  // // vec3 colorDispersionBurn = vec3(0.2, 0.7, 0.7);
  // // vec3 colorDispersionBurn = mix(vec3(25.0 / 255.0, 62.0 / 255.0, 74.0 / 255.0), vec3(0.2, 0.7, 0.7), uProgress);
  // vec3 colorDispersionBurn = vec3(5.0 / 255.0, 42.0 / 255.0, 54.0 / 255.0);
  // vec3 finalColorBurn = colorDispersionBurn * cutout;
  // vec4 finalColor2 = outputWithBurn;
  // finalColor2.rgb += finalColorBurn;
  // gl_FragColor = finalColor2;

  // exploring distorting grid & chromatic abberation
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // float chromaticCircle = smoothstep(0.0, 0.3, length(centeredUvs));
  // vec2 colorOffset = normalize(centeredUvs) * .03 * smoothstep(0.0, 0.3, chromaticCircle);
  // float dist = length(centeredUvs);
  // float radius = mix(0.0, 1.0, uProgress);
  // float cutoutWidth = 0.2;
  // float circle1 = 1.0 - smoothstep(radius, radius + 0.8, dist);
  // float circle2 = 1.0 - smoothstep(radius + cutoutWidth, radius + cutoutWidth + 0.8, dist);
  // float cutout = circle2 - circle1;
  // cutout = 0.0;
  // float redChannel = 0.0;
  // float greenChannel = 0.0;
  // float blueChannel = 0.0;
  // float diagonalsR = addDiagonals(uv - colorOffset, cutout);
  // redChannel += diagonalsR;
  // float diagonalsG = addDiagonals(uv, cutout);
  // greenChannel += diagonalsG;
  // float diagonalsB = addDiagonals(uv + colorOffset, cutout);
  // blueChannel += diagonalsB;*
  // float diagonals = diagonalsR + diagonalsG + diagonalsB;
  // // float straightLines = mix(0.05, addBoxes(uv), smoothstep(0.1, 0.5, vPosition.z));
  // // float finalDiagonals = diagonals * 1.8;
  // float straightLinesR = addBoxes(uv - colorOffset, cutout);
  // redChannel += straightLinesR;
  // float straightLinesG = addBoxes(uv, cutout);
  // greenChannel = straightLinesG;
  // float straightLinesB = addBoxes(uv + colorOffset, cutout);
  // blueChannel += straightLinesB;
  // float straightLines = straightLinesR + straightLinesG + straightLinesB;
  // float finalDiagonals = mix(0.05, diagonals, heightB);
  // // float finalDiagonals = mix(0.05, diagonals, smoothstep(0.1, 0.5, vPosition.z));
  // // float grid = finalDiagonals + straightLines;
  // vec3 testCol = vec3(redChannel, greenChannel, blueChannel);
  // float grid = diagonals + straightLines;
  // vec3 colorGridLines = vec3(1.0, 1.0, 1.0);
  // vec3 finalGrid = colorGridLines * grid;
  // finalGrid.r *= heightR;
  // // finalGrid.b += smoothstep(0.1, 0.5, vPosition.z);
  // // finalGrid = vec3(heightR, 0.0, 0.0);
  // vec4 doubleBufferColor = texture2D(uDoubleBufferTexture, vUv);
  // vec4 transparent = vec4(vPosition.z, 0.0, 0.0, 0.0);
  // vec4 gridAndMouseTexels = mix(vec4(finalGrid, 1.0), transparent, length(doubleBufferColor.rgb));
  // // gl_FragColor = gridAndMouseTexels;
  // // vec2 colorOffset = normalize(cUV) * .003 * smoothstep(0.0, 0.3, length(cUV - correctedMousePosition.xy));
  // gl_FragColor = vec4(length(colorOffset), 0.0, 0.0, 1.0);
  // gl_FragColor = vec4(vec3(grid), 1.0);
  // gl_FragColor = vec4(testCol, 1.0);
  // // gl_FragColor = vec4(cutout, 0.0, 0.0, 1.0);
  // // gl_FragColor = vec4(chromaticCircle, 0.0, 0.0, 1.0);

  // combining burn with distortion
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // FOR BETTER PERFORMANCE, LOWER OCTAVES AND REMOVE PERLIN NOISE IN EDGE
  // FOR BETTER VISUALS, INCREASE OCTAVES (8+) AND ADD PERLIN NOISE IN EDGE 

  // float perlinNoise3D = classic3d(vec3(vec2(centeredUvs * 7.0), uTime * 0.5));
  float fbmNoise2 = fbm(vec3(centeredUvs * 7.0, uTime * 0.0), 6);
  float dist = length(centeredUvs)
    //  + perlinNoise3D * 0.05
  + fbmNoise2 * 0.2;
  float smoothStepThickness = 0.002;
  float radius = mix(0.0, 1.0, uProgress);
  // float edgeWidthBurn = 0.003 + abs(perlinNoise3D * 0.01);
  // float edgeWidthBurn = 0.003 + clamp(fbmNoise2 * 0.02, -0.002, 0.002);
  float edgeWidthBurn = 0.003;
  float fadeThickness = 0.05;
  // float fadeThickness = 0.0;

   // float t1 = clamp((dist - radius) / smoothStepThickness, 0.0, 1.0);
  // float cutout = smoothstep(edgeWidthBurn, edgeWidthBurn + smoothStepThickness, t1);
  // Calculation
  // float midStart = radius + edgeWidthBurn;
  // float midEnd = midStart + smoothStepThickness;
  // float midPoint = (midStart + midEnd) * 0.5;
  // float halfThickness = smoothStepThickness * 0.

  // float cutout = smoothstep(midPoint - halfThickness, midPoint + halfThickness, dist);

  float circle1 = 1.0 - smoothstep(radius, radius + smoothStepThickness, dist);
  float circle2 = 1.0 - smoothstep(radius + edgeWidthBurn, radius + edgeWidthBurn + smoothStepThickness, dist);
  // float circle5 = 1.0 - smoothstep(radius, radius + smoothStepThickness, dist);
  float cutout = circle2 - circle1;

  float circle3 = 1.0 - smoothstep(radius, radius + smoothStepThickness + fadeThickness, dist);
  float circle4 = 1.0 - smoothstep(radius, radius + smoothStepThickness + fadeThickness + 0.20, dist);
  float fadeOutScale = 1.0 - circle3;

  circle4 = 0.0;

  float diagonals = addDiagonals(uv, circle4);
  float straightLines = addBoxes(uv, circle4);
  float finalDiagonals = mix(0.05, diagonals, heightB);
  // float finalDiagonals = diagonals;
  // float finalStraights = mix(0.05, straightLines, heightB);
  float finalStraights = straightLines;
  // float grid = finalDiagonals + straightLines;
  float grid = finalDiagonals + finalStraights;
  // float grid = 0.2;
  vec3 colorGridLines = vec3(1.0, 1.0, 1.0);
  vec3 finalGrid = colorGridLines * grid;
  finalGrid.r *= heightR;

  vec4 doubleBufferColor = texture2D(uDoubleBufferTexture, vUv);
  vec4 transparent = vec4(vPosition.z, 0.0, 0.0, 0.0);
  vec4 gridAndMouseTexels = mix(vec4(finalGrid, 1.0), transparent, length(doubleBufferColor.rgb));

  gl_FragColor = gridAndMouseTexels;

  vec4 outputWithBurn = gridAndMouseTexels;
  outputWithBurn.rgb *= fadeOutScale;
  vec3 colorDispersionBurn = vec3(5.0 / 255.0, 42.0 / 255.0, 54.0 / 255.0);
  // vec3 colorDispersionBurn = vec3(255.0 / 255.0, 42.0 / 255.0, 0.0 / 255.0);
  vec3 finalColorBurn = colorDispersionBurn * cutout;
  vec4 finalColor2 = outputWithBurn;
  finalColor2.rgb += finalColorBurn;

  // gl_FragColor = vec4(vPosition.z, 0.2, 0.0, 1.0);

  finalColor2.a = 1.0 - circle1; 
  // finalColor2.r += circle5;

  gl_FragColor = finalColor2;

  // gl_FragColor = vec4(vec3(grid), 1.0);

  // gl_FragColor = gridAndMouseTexels;

  // gl_FragColor = vec4(vPosition.z, 0.0, 0.0, 1.0);

  // gl_FragColor = vec4(vec3(grid), 1.0);

  // gl_FragColor = vec4(circle3, 0.0, 0.0, 1.0);
  // gl_FragColor = vec4(circle3, circle4, 0.0, 1.0);

  // gl_FragColor = vec4(vUv, 0.0, 1.0);
}
