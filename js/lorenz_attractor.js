class LorenzAttractorRenderer {
    // Screen:
    // Vertical axis: [-50, 50]
    // Origin: (-7, 25)

    SIGMA = 10;
    RO = 28;
    BETA = 2.667;
    
    constructor(ctx) {
        this.ctx = ctx;

        this.points = [];
        for (let i = 0; i < 12; i++) {
            this.points.push([
                new Vec3( Math.random() * 50 - 25, 1., Math.random() * 50 - 25), // Position
                255
            ]);
        }
    }

    _lorenz(p, s=10, r=28, b=2.667) {
        return new Vec3(
            s * (p.y - p.x),
            p.x * (r - p.z) - p.y,
            p.x * p.y - b * p.z
        );
    }

    render(dt) {
        const canvas = this.ctx.canvas;
        const ctx = this.ctx;

        /* Transform setup */
        ctx.save();

        ctx.translate(canvas.clientWidth / 2, canvas.clientHeight / 2);

        let scale = canvas.clientHeight / 100;
        ctx.scale(scale, scale);

        ctx.translate(3, -25);

        /* Draw point */
        for (let point of this.points) {
            let old = point[0].clone();

            // Apply lorenz step
            let d = this._lorenz(point[0]);
            point[0].add(d.mulScalar(0.001));

            // XZ plane projection
            ctx.beginPath();
            ctx.moveTo(old.x, old.z);
            ctx.lineTo(point[0].x, point[0].z);
            ctx.lineWidth = 0.1;
            ctx.strokeStyle = `rgb(${point[1]}, ${point[1]}, ${point[1]})`;
            ctx.stroke();
        }

        /* */
        ctx.restore();
    }
}
