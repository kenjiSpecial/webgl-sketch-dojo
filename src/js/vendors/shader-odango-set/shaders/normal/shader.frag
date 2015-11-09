varying vec2 vUv;
uniform float opacity;
uniform vec2 uWindow;
uniform sampler2D tDiffuse;


void main() {
    float xPos = vUv.x;
    float yPos = vUv.y;

    float xOffset = 1.0/uWindow.x;
    float yOffset = 1.0/uWindow.y;

    float center      = texture2D( tDiffuse, vec2(xPos          , yPos ) ).r;
    float topLeft     = texture2D( tDiffuse, vec2(xPos - xOffset, yPos - yOffset) ).r;
    float left        = texture2D( tDiffuse, vec2(xPos - xOffset, yPos)           ).r;
    float bottomLeft  = texture2D( tDiffuse, vec2(xPos - xOffset, yPos+ yOffset)  ).r;
    float top         = texture2D( tDiffuse, vec2(xPos          , yPos - yOffset) ).r;
    float bottom      = texture2D( tDiffuse, vec2(xPos          , yPos + yOffset) ).r;
    float topRight    = texture2D( tDiffuse, vec2(xPos + xOffset, yPos - yOffset) ).r;
    float right       = texture2D( tDiffuse, vec2(xPos + xOffset, yPos)           ).r;
    float bottomRight = texture2D( tDiffuse, vec2(xPos + xOffset, yPos+ yOffset)  ).r;


    float dX = topRight + 2.0 * right + bottomRight - topLeft - 2.0 * left - bottomLeft;
    float dY = bottomLeft + 2.0 * bottom + bottomRight - topLeft - 2.0 * top - topRight;

    vec3 N = normalize( vec3( dX, dY, 0.01) );

    N *= 0.5;
    N += 0.5;

    gl_FragColor.rgb = N;
    gl_FragColor.a = 1.0;

}
