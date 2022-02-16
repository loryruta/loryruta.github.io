let canvas;
let gl;

// --------------------------------------------------------------------------------------------------------------------------------
// Utils
// --------------------------------------------------------------------------------------------------------------------------------

function compileShader(shaderType, shaderSrc) {
    let shader = gl.createShader(shaderType);
    gl.shaderSource(shader, shaderSrc);
    gl.compileShader(shader);
    
    let err = gl.getShaderInfoLog(shader);
    if (err) {
        console.error(err);
    }

    return shader;
}

function linkProgram(prog) {
    gl.linkProgram(prog);

    let err = gl.getProgramInfoLog(prog);
    if (err) {
        console.error(err);
    }
}

// --------------------------------------------------------------------------------------------------------------------------------
// Background renderer
// --------------------------------------------------------------------------------------------------------------------------------

class BgRenderer {
    constructor(canvas, gl) {
        this.canvas = canvas;
        this.gl = gl;

        this.initGlObjects();
    }

    async initGlObjects() {
        this.screenQuadVao = gl.createVertexArray();

        this.prog = gl.createProgram();

        const vertShadSrc = await (await fetch("/shaders/bg_shad.vert")).text();
        this.vertShad = compileShader(gl.VERTEX_SHADER, vertShadSrc);
        gl.attachShader(this.prog, this.vertShad);

        const fragShadSrc = await (await fetch("/shaders/bg_shad.frag")).text();
        this.fragShad = compileShader(gl.FRAGMENT_SHADER, fragShadSrc);
        gl.attachShader(this.prog, this.fragShad);

        linkProgram(this.prog);
    }

    render() {
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.clearColor(0.0, 0.0, 0.0, 0.0);

        gl.useProgram(this.prog);

        gl.uniform2f(gl.getUniformLocation(this.prog, 'u_resolution'), canvas.width, canvas.height);
        gl.uniform1f(gl.getUniformLocation(this.prog, 'u_time'), performance.now() / 1000.0);

        gl.bindVertexArray(this.screenQuadVao);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
}

// --------------------------------------------------------------------------------------------------------------------------------
// Main
// --------------------------------------------------------------------------------------------------------------------------------

window.addEventListener('load', function () {
    canvas = document.getElementById("myCanvas");
    gl = canvas.getContext("webgl2");

    const bgRenderer = new BgRenderer(canvas, gl);

    const resize = () => {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;

        gl.viewport(0, 0, canvas.width, canvas.height);
    };

    resize();
    window.addEventListener('resize', resize);

    const renderCycle = () => {
        bgRenderer.render();
        window.requestAnimationFrame(renderCycle);
    };
    window.requestAnimationFrame(renderCycle);
});
