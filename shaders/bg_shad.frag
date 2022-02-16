#version 300 es

precision highp float;

#define MAX_ITER 255

#define MAX_OUTWARD_ZOOM 0.7
#define MAX_INWARD_ZOOM 10000.0
#define THRESHOLD 1.0

uniform vec2 u_resolution;
uniform float u_time;

out vec4 f_color;

vec3 map_color(float it)
{
    return vec3(abs(cos(it)));
}

void main()
{
    const vec2 trasl = vec2(-0.7449, 0.1);

    // point on screen between [-1, 1]
    vec2 frag_p = (gl_FragCoord.xy / u_resolution.xy) * 2.0 - 1.0;

    vec2 mb_c = vec2(0) + trasl; // mandelbrot center point
    vec2 mb_p = frag_p + trasl; // mandelbrot point under analysis 
    
    float s = (abs(mod(u_time * 0.01, 1.0)) * (MAX_INWARD_ZOOM - MAX_OUTWARD_ZOOM)) + MAX_OUTWARD_ZOOM; // scaling factor
    vec2 zoomed_p = (mb_p - mb_c) * (1.0 / s) + mb_c; // the zoomed point

    vec2 p0 = zoomed_p;
    vec2 p = vec2(0);
    
    int it = 0;
    while ((p.x * p.x + p.y * p.y) <= 2.0 * 2.0 && it < MAX_ITER)
    {
        float tmp = p.x * p.x - p.y * p.y + p0.x;
        p.y = 2.0 * p.x * p.y + p0.y;
        p.x = tmp;
        it++;
    }

    f_color = vec4(map_color(float(it)), 1.0); 
}
