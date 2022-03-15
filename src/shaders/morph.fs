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


// Author: paniq
// License: MIT
uniform float strength; // = 0.1

vec4 transition(vec2 p) {
  vec4 ca = getFromColor(p);
  vec4 cb = getToColor(p);
  
  vec2 oa = (((ca.rg+ca.b)*0.5)*2.0-1.0);
  vec2 ob = (((cb.rg+cb.b)*0.5)*2.0-1.0);
  vec2 oc = mix(oa,ob,0.5)*strength;
  
  float w0 = progress;
  float w1 = 1.0-w0;
  return mix(getFromColor(p+oc*w0), getToColor(p-oc*w1), progress);
}




void main()	{
	gl_FragColor = transition(vUv.xy);
}