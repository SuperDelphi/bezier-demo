export class Point {
    x;
    y;

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(point) {
        if (point instanceof Point) {
            // If it's a Point
            return new Point(this.x + point.x, this.y + point.y);
        } else {
            // If it's a scalar value
            return new Point(this.x * point, this.y * point);
        }
    }

    multiply(point) {
        if (point instanceof Point) {
            // If it's a Point
            return new Point(this.x * point.x, this.y * point.y);
        } else {
            // If it's a scalar value
            return new Point(this.x * point, this.y * point);
        }
    }

    clone() {
        return new Point(this.x, this.y);
    }
}