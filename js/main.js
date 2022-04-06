function main() {
    let canvas = document.getElementById("myCanvas");
    //let gl = canvas.getContext("webgl2");
    let drawer = canvas.getContext("2d");

    /* Handle resize */
    const resize = () => {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;

        //gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    /* */
    const renderer = new LorenzAttractorRenderer(drawer);

    let startTime = performance.now();

    /* Render cycle */
    let dt = 0;
    let fpsCtr = 0;
    let lastTime = -1;
    const renderCycle = () => {
        let curTime = performance.now();

        if (curTime - startTime > 3000) {
            renderer.render(dt);
        }

        fpsCtr++;

        if (lastTime > 0)
            dt = curTime - lastTime;
        lastTime = curTime;

        window.requestAnimationFrame(renderCycle);
    };
    window.requestAnimationFrame(renderCycle);

    /* FPS */
    const setFps = function (fps) {
        console.log("FPS: " + fps);
    };

    setFps(0);
    setInterval(() => {
        setFps(fpsCtr);
        fpsCtr = 0;
    }, 1000);
}

window.addEventListener('load', main);
