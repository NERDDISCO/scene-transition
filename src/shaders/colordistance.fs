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


// License: MIT
// Author: P-Seebauer
// ported by gre from https://gist.github.com/P-Seebauer/2a5fa2f77c883dd661f9

uniform float power; // = 5.0

vec4 transition(vec2 p) {
  vec4 fTex = getFromColor(p);
  vec4 tTex = getToColor(p);
  float m = step(distance(fTex, tTex), progress);
  return mix(
    mix(fTex, tTex, m),
    tTex,
    pow(progress, power)
  );
}





void main()	{
	gl_FragColor = transition(vUv.xy);
}