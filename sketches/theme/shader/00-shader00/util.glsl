

vec3 get0( vec2 inputPos ){

      //float[5](3.4, 4.2, 5.0, 5.2, 1.1);


    return vec3(1.0, 0.0, 0.0);
}

vec3 myFunction( vec2 resolution, vec2 topLeft ){
    vec3 col;

    float typeSize   = 210.;
    float typeMargin = 50.;
    float typeWidth  = 470.;
    float typeHeight = 350.;

    if(gl_FragCoord.x > topLeft.x && gl_FragCoord.x < (topLeft.x + typeWidth) && gl_FragCoord.y > topLeft.y &&  gl_FragCoord.y < (topLeft.y + typeHeight) ){

        vec2 pos = gl_FragCoord.xy - topLeft.xy;
        if( pos.x < typeSize ){
            col = get0(pos);
        }else{
            col = vec3(1.0, 1.0, 1.0);
        }

    }else{
        col = vec3(1.0, 1.0, 1.0);
    }

    return col;
}

#pragma glslify: export(myFunction)