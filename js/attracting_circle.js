
const AttractingCircle = {
    // The size of the history stored per-point
    maxHistorySize: 128,

    // Every how much distance a new history entry should be added
    saveHistoryEveryLength: 0.1,

    // The height of the screen
    screenHeight: 4,

    lineWidth: 0.005
};

AttractingCircle.maxHistorySize = 8;

AttractingCircle.Point = class {
    constructor(position, velocity) {
        this.position = position;
        this.velocity = velocity;
        this.speed = 5.0;

        this.history = [];

        console.assert(Math.round(this.velocity.length()) == 1);
    }

    goForward(step) {
        this.position.add(this.velocity.clone().mulScalar(step));

        if (this.history.length == 0 || this.history[0].distance(this.position) >= AttractingCircle.saveHistoryEveryLength) {
            this.history.unshift(this.position.clone());
            if (this.history.length > AttractingCircle.maxHistorySize) {
                this.history.pop();
            }    
        }
    }
}


AttractingCircle.Background = class {
    constructor(context) {
        this.context = context;

        this.center = new Vec2(0, 0);
        this.radius = 1.0;
        this.attractionForce = 0.03;

        this.points = [];

        // Click listener to spawn points
        this.context.canvas.addEventListener('click', event => this._onClick(event));

        this.renderInit();
    }

    _onClick(event) {
        let canvas = this.context.canvas;

        let position = new Vec2(
            (event.clientX - canvas.clientWidth / 2) * AttractingCircle.screenHeight / canvas.clientHeight,
            (event.clientY - canvas.clientHeight / 2) * AttractingCircle.screenHeight / canvas.clientHeight
        );

        if ((position.clone().sub(this.center)).length() < this.radius) {
            return; // Can't place points within the circle
        }

        let velocity = new Vec2(-Math.sign(position.x), -Math.sign(position.y)).normalize();
        let point = new AttractingCircle.Point(position, velocity);
    
        this.addPoint(point);

        console.log("cursor", event.clientX, event.clientY, "point", position.x, position.y);
    }

    addPoint(point) {
        this.points.unshift(point);

        if (this.points.length > 100) {
            this.points.pop();
        }
    }

    _rayCircleIntersectionTest(ro, rd, c, r) {
        // https://www.geometrictools.com/Documentation/IntersectionLine2Circle2.pdf
        
        let D = ro.clone().sub(c);
        let rdDotD = rd.dot(D);
        let Dlen = D.length();
        let d = rdDotD * rdDotD - (Dlen * Dlen - r * r);

        if (d < 0) { // No intersection at all
            return false;
        }

        let t = (-rdDotD - Math.sqrt(d)) / (Dlen * Dlen);
        if (t < 0) { // Intersected behind the ray origin
            return false;
        }

        return t;
    }

    _transformCanvas(callback) {
        let context = this.context;
        let canvas = context.canvas;

        context.save();
        
        context.translate(canvas.clientWidth / 2, canvas.clientHeight / 2);

        let scale = canvas.clientHeight / AttractingCircle.screenHeight;
        context.scale(scale, scale);

        callback();

        context.restore();
    }

    _updatePoint(point, dt) {
        let step = point.speed * dt;

        const maxIter = 32;

        //while (true) {
        for (let i = 0; i < maxIter; i++) {
            let normal = point.position.clone().sub(this.center).normalize();
            let attractor = normal.clone().mulScalar(-this.attractionForce);

            point.velocity.add(attractor).normalize();
  
            let t = this._rayCircleIntersectionTest(point.position, point.velocity, this.center, this.radius);

            if (t === false || step < t) {
                point.goForward(step);
                break;
            } else {
                point.goForward(t - 0.01);
                step -= t;
                point.velocity.reflect(normal);
            }
        }
    }

    renderInit() {
        let context = this.context;
        let canvas = this.context.canvas;

        // Initial clear
        context.fillStyle = `#1a237e`;
        context.fillRect(0, 0, canvas.width, canvas.height);

        // Draw attracting circle
        this._transformCanvas(() => {
            context.beginPath();
            context.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2);
            context.lineWidth = AttractingCircle.lineWidth;
            context.strokeStyle = `white`;
            context.stroke();
        });
    }

    render(dt) {
        let context = this.context;
        let canvas = context.canvas;

        this._transformCanvas(() => {
            for (let point of this.points) {
                context.beginPath();
    
                context.moveTo(point.position.x, point.position.y);
    
                this._updatePoint(point, dt)
    
                context.lineTo(point.position.x, point.position.y);
    
                context.lineWidth = AttractingCircle.lineWidth;

                context.strokeStyle = `rgb(19, 26, 92)`;
                context.stroke();
            }
        });

        context.beginPath();
        context.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2);
        context.lineWidth = AttractingCircle.lineWidth;
        context.strokeStyle = `white`;
        context.stroke();
    }
}
