
class Vec2 {
    constructor(x, y) {
        if (x !== undefined && y === undefined) {
            this.x = x.x; // First parameter is assumed to be a Vec2
            this.y = x.y;
        } else {
            this.x = x || 0;
            this.y = y || 0;
        }
    }
    
    set(v) {
        this.x = v.x;
        this.y = v.y;
        return this;
    }

    add(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    }

    sub(v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }

    mulScalar(s) {
        this.x *= s;
        this.y *= s;
        return this;
    }

    mul(v) {
        this.x *= v.x;
        this.y *= v.y;
        return this;
    }

    dot(v) {
        return this.x * v.x + this.y * v.y;
    }

    lengthSquared() {
        return this.dot(this);
    }

    length() {
        return Math.sqrt(this.lengthSquared());
    }

    distance(v) {
        return new Vec2(this).sub(v).length();
    }

    normalize() {
        let length = this.length();

        console.assert(length > 0);

        this.x /= length;
        this.y /= length;
        return this;
    }

    reflect(pivot) {
        // https://math.stackexchange.com/questions/13261/how-to-get-a-reflection-vector

        return this.sub(new Vec2(pivot).mulScalar(2 * (this.dot(pivot))));
    }

    clone() {
        return new Vec2(this.x, this.y);
    }
}

class Vec3 {
    constructor(x, y, z) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
    }
    
    add(v) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
    }

    sub(v) {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        return this;
    }

    mulScalar(s) {
        this.x *= s;
        this.y *= s;
        this.z *= s;
        return this;
    }

    mul(v) {
        this.x *= v.x;
        this.y *= v.y;
        this.z *= v.z;
        return this;
    }

    clone() {
        return new Vec3(this.x, this.y, this.z);
    }
}
