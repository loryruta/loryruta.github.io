#version 300 es

precision highp float;

#define MIN_ITER 128.0
#define MAX_ITER 256.0

#define MAX_OUTWARD_ZOOM 0.7
#define MAX_INWARD_ZOOM 80000.0
#define THRESHOLD 1.0

uniform vec2 u_resolution;
uniform float u_time;

out vec4 f_color;

float scaling_func(float t)
{
    return pow(abs(sin(t * 0.1)), 5.0);
}

vec3 map_color(float it_val, float t)
{
    vec3 base_col = vec3(201.0 / 255.0, 33.0 / 255.0, 24.0 / 255.0);

    return vec3(sin(it_val * 3.14)) * base_col;
}

void main()
{
    const vec2 trasl = vec2(-0.7449, 0.1);

    // point on screen between [-1, 1]
    vec2 frag_p = (gl_FragCoord.xy / u_resolution.xy) * 2.0 - 1.0;

    vec2 mb_c = vec2(0) + trasl; // mandelbrot center point
    vec2 mb_p = frag_p + trasl; // mandelbrot point under analysis 
    
    float s = scaling_func(u_time) * (MAX_INWARD_ZOOM - MAX_OUTWARD_ZOOM) + MAX_OUTWARD_ZOOM; // scaling factor
    vec2 zoomed_p = (mb_p - mb_c) * (1.0 / s) + mb_c; // the zoomed point

    vec2 p0 = zoomed_p;
    vec2 p = vec2(0);
    
    float it = 0.0;
    float max_iter = MAX_ITER;//(abs(cos(u_time)) * MAX_ITER + MIN_ITER) - MIN_ITER;

    while ((p.x * p.x + p.y * p.y) <= 2.0 * 2.0 && it < max_iter)
    {
        float tmp = p.x * p.x - p.y * p.y + p0.x;
        p.y = 2.0 * p.x * p.y + p0.y;
        p.x = tmp;
        
        it += 1.0;
    }

    f_color = vec4(map_color(it / max_iter, u_time), 1.0); 
}
