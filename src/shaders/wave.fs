uniform float time;
	
uniform sampler2D texture1;
uniform sampler2D texture2;

uniform float progress;

uniform float intensity;

varying vec2 vUv;

vec4 getFromColor(vec2 inUV)	{
	return texture2D(texture1, inUV);
}
vec4 getToColor(vec2 inUV)	{
	return texture2D(texture2, inUV);
}

// Author: haiyoucuv, changed by NERDDISCO
// License: MIT

vec4 transition (vec2 uv) {
  
  vec2 p1 = uv + 0.01 * vec2(sin(intensity * uv.x * progress), cos(intensity * uv.y * progress));
  vec2 p2 = uv + 0.01 * vec2(sin(intensity * uv.x * (1. - progress)), cos(intensity * uv.y * (1. - progress)));

  return mix(
    getFromColor(p1),
    getToColor(p2),
    progress
  );
}



void main()	{
	gl_FragColor = transition(vUv.xy);
}