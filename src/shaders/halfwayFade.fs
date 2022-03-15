uniform float time;

uniform sampler2D texture1;
uniform sampler2D texture2;

uniform float progress;

varying vec2 vUv;

void main(void) {
    // Load the textures
    vec4 scene1 = texture2D(texture1, vUv);
    vec4 scene2 = texture2D(texture2, vUv);

    // Split the screen into two halves and 
    // mix scene1 with scene2 based on the given progress
    if (vUv.y < .5) {
        gl_FragColor = mix(scene2, scene1, abs(progress));
    } else {
        gl_FragColor = mix(scene1, scene2, abs(progress));
    }
}