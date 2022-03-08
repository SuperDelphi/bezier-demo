import { SelectTool}  from "./Tool/SelectTool.js";
import { CurveTool } from "./Tool/CurveTool.js";

export class EditorContext {
    // Editor tools
    SELECT_TOOL;
    CURVE_TOOL;

    STROKE_STYLE = "#CCCCCC";
    LINE_WIDTH = 1.5;
    RESOLUTION = 25;

    // H = Hover, S = Selected
    POINT_FILL = "white";
    POINT_STROKE = "#888888";
    POINT_SIZE = 5;
    H_POINT_FILL = "#888888";
    H_POINT_STROKE = "#888888";
    H_POINT_SIZE = 7;
    S_POINT_FILL = "#0095FF";
    S_POINT_STROKE = "#0095FF";
    S_POINT_SIZE = 9;

    canvas;
    points = [];
    curves = [];
    currentTool;

    constructor(canvas) {
        this.canvas = canvas;

        // Initializing tools
        this.SELECT_TOOL = new SelectTool(this, canvas);
        this.CURVE_TOOL = new CurveTool(this, canvas);
    }

    init() {
        this.useTool(this.CURVE_TOOL); // This is the default tool
    }

    useTool(tool) {
        if (this.currentTool) this.currentTool.unmount();
        this.currentTool = tool;
        this.currentTool.mount();
        this.updateCanvas();
    }

    updateCanvas() {
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Curves
        this.curves.forEach(curve => {
            this._drawBezier(curve.getPoints(true), false, curve.color);
        });

        // Points
        this.points.forEach(point => {
            this._drawPoint(point);
        });
    }

    // ADDING METHODS

    addPoint(point) {
        this.points.push(point);
    }

    addCurve(curve) {
        const endPoints = curve.getPoints();
        this.points.push(endPoints[0]);
        this.points.push(endPoints[1]);
        this.curves.push(curve);
    }

    // DRAWING METHODS

    _drawPoint(point, strokeStyle=this.POINT_STROKE, fillStyle=this.POINT_FILL, size=this.POINT_SIZE) {
        const ctx = this.canvas.getContext("2d");

        ctx.strokeStyle = strokeStyle;
        ctx.fillStyle = fillStyle;

        ctx.beginPath();
        ctx.ellipse(point.x, point.y, size, size, 0, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    }

    _drawLine(from, to, strokeStyle=this.STROKE_STYLE, lineWidth=this.LINE_WIDTH) {
        const ctx = this.canvas.getContext("2d");

        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = lineWidth;

        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
    }

    _drawPolygon(points, strokeStyle=this.STROKE_STYLE, lineWidth=this.LINE_WIDTH) {
        const ctx = this.canvas.getContext("2d");

        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = lineWidth;

        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        
        points.forEach(p => {
            ctx.lineTo(p.x, p.y);
        });

        ctx.stroke();
    }

    /**
     * Draws a Bézier curve on a canvas.
     * @param {*} canvas Canvas.
     * @param {*} controlPoints Control points.
     * @param {int} n Resolution of the curve.
     * @param {*} strokeStyle Color of the curve stroke.
     * @param {boolean} debug Whether to display handles and control points on the canvas or not.
     */
     _drawBezier(controlPoints, handles=false, strokeStyle=this.STROKE_STYLE, curveState) {
        /**
         * Generates n points from the Bézier curve
         * defined by the p1, p2, p3 and p4 control points.
        */
        const bezierPoints = (p1, p2, p3, p4, n) => {
            const points = [];

            for (let i = 0; i < n; i++) {
                const t = i / (n - 1); // Curve parameter

                let p = p1.multiply(Math.pow(1 - t, 3));
                p = p.add(p2.multiply(3 * Math.pow(1 - t, 2) * t));
                p = p.add(p3.multiply(3 * (1 - t) * t * t));
                p = p.add(p4.multiply(t * t * t));

                points.push(p.clone());
            }

            return points;
        };

        const points = bezierPoints(...controlPoints, this.RESOLUTION);
        this._drawPolygon(points, strokeStyle); // Draws the curve

        // Draws the handles
        if (handles) {
            const HANDLE_COLOR = "#bbbbbb";
            const SELECTED_HANDLE_COLOR = "#00CAE9";
            const HANDLE_WIDTH = 1.5;

            this._drawLine(controlPoints[0], controlPoints[1], curveState === false ? SELECTED_HANDLE_COLOR : HANDLE_COLOR, HANDLE_WIDTH);
            this._drawLine(controlPoints[2], controlPoints[3], curveState === true ? SELECTED_HANDLE_COLOR : HANDLE_COLOR, HANDLE_WIDTH);

            // Draws all points when handles = true, otherwise only points defining the ends of the curve
            for (let i = 0; i < controlPoints.length; i++) {
                if (i === 0 || i === 3 || handles) {
                    this._drawPoint(controlPoints[i]);
                }
            }
        }
    }
}