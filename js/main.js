
let background;

function main() {
    let canvas = document.getElementById("myCanvas");
    //let gl = canvas.getContext("webgl2");
    let context = canvas.getContext("2d");

    // 
    background = new AttractingCircle.Background(context);

    // Handle resize
    const resize = () => {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;

        background.renderInit();

        //gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    // Render loop
    let fpsCtr = 0;

    let lastTime = null;

    const renderCycle = async () => {
        let now = performance.now();
        let dt = lastTime !== null ? (now - lastTime) / 1000.0 : 0;
    
        background.render(dt);
        fpsCtr++;

        lastTime = now;

        window.requestAnimationFrame(renderCycle);
    };
    window.requestAnimationFrame(renderCycle);

    // FPS clock
    const setFps = function (fps) {
        //console.log("FPS: " + fps);
    };

    setFps(0);
    setInterval(() => {
        setFps(fpsCtr);
        fpsCtr = 0;
    }, 1000);
}

window.addEventListener('load', main);
