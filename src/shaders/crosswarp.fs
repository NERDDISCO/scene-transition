uniform float time;
	
uniform sampler2D texture1;
uniform sampler2D texture2;

uniform float progress;

varying vec2 vUv;

vec4 getFromColor(vec2 inUV)	{
	return texture2D(texture1, inUV);
}
vec4 getToColor(vec2 inUV)	{
	return texture2D(texture2, inUV);
}


// Author: Eke Péter <peterekepeter@gmail.com>
// License: MIT
vec4 transition(vec2 p) {
  float x = progress;
  x = smoothstep(.0, 1.0, (x*2.0+p.x-1.0));
  return mix(getFromColor((p-.5)*(1.-x)+.5), getToColor((p-.5)*x+.5), x);
}



void main()	{
	gl_FragColor = transition(vUv.xy);
}