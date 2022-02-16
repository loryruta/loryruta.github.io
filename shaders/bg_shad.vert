#version 300 es

precision highp float;

vec2 k_screen_quad[] = vec2[](
    vec2(-1.0, -1.0),
    vec2(-1.0, 1.0),
    vec2(1.0, -1.0),
    vec2(1.0, -1.0),
    vec2(-1.0, 1.0),
    vec2(1.0, 1.0)
);

void main()
{
    gl_Position = vec4(k_screen_quad[gl_VertexID], 0.0, 1.0);
}
