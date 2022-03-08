export class BezierCurve {
    endPoints = [];
    controlPoints = [];
    color;

    constructor (points, color="black") {
        this.endPoints.push(points[0]);
        this.endPoints.push(points[3]);
        this.controlPoints.push(points[1]);
        this.controlPoints.push(points[2]);
        this.color = color;
    }

    getPoints(controlPoints=false) {
        if (controlPoints) {
            return [this.endPoints[0], this.controlPoints[0], this.controlPoints[1], this.endPoints[1]];
        } else {
            return this.endPoints;
        }
    }
}