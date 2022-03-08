import { Tool } from "./Tool.js";

import { Point } from "../Point.js";
import { BezierCurve } from "../BezierCurve.js";

export class CurveTool extends Tool {
    mousedown_handler(e) {
        if (e.button === 2) {
            // If right click, cancel curve
            this._resetControlPoints();
            this.curveState = false;
            this._updateCanvas(e);
            return;
        }
        if (!this.curveState) {
            // First point
            const coords = this._getRelativeMousePos(this.canvas, e);
            this.controlPoints.p1 = new Point(coords.x, coords.y);
        } else {
            // Second point
            const coords = this._getRelativeMousePos(this.canvas, e);
            this.controlPoints.p4 = new Point(coords.x, coords.y);
        }
        this._updateCanvas(e);
    }
    mouseup_handler(e) {
        if (e.button === 2) {
            // If right click, cancel curve
            this._resetControlPoints();
            this.curveState = false;
            this._updateCanvas(e);
            return;
        }
        if (!this.curveState) {
            if (this.controlPoints.p1) {
                // First handle
                const coords = this._getRelativeMousePos(this.canvas, e);
                this.controlPoints.p2 = new Point(coords.x, coords.y);
                this.curveState = true;
            }
        } else {
            if (this.controlPoints.p4) {
                // Second handle
                const coords = this._getRelativeMousePos(this.canvas, e);
                this.controlPoints.p3 = new Point(coords.x, coords.y);

                // We confirm the addition of the curve to the editor context
                this.editorContext.addCurve(new BezierCurve(Object.values(this.controlPoints)));
                this.curveState = false;
                this._resetControlPoints();
            }
        }
        this._updateCanvas(e);
    }
    contextmenu_handler(e) {
        e.preventDefault(); // Prevents right-click context menu
    }
    mousemove_handler(e) {
        this._updateCanvas(e);
    }

    events = {
        "mousedown": this.mousedown_handler.bind(this),
        "mouseup": this.mouseup_handler.bind(this),
        "contextmenu": this.contextmenu_handler.bind(this),
        "mousemove": this.mousemove_handler.bind(this)
    }

    ICON_PATH = "img/curve_tool.png";
    controlPoints;
    visiblePoints;
    curveState = false; // false : curve not started, true : curve started

    constructor(editorContext, canvas) {
        super(editorContext, canvas);
        this._resetControlPoints();
    }

    _getVisualControlPoints(e) {
        const vControlPoints = {p1: null, p2: null, p3: null, p4: null};
        const mouseCoords = this._getRelativeMousePos(this.canvas, e);

        Object.keys(this.controlPoints).forEach(key => {
            if (this.controlPoints[key]) {
                vControlPoints[key] = this.controlPoints[key];
            } else {
                vControlPoints[key] = new Point(mouseCoords.x, mouseCoords.y);
            }
        })

        return vControlPoints;
    }

    _resetControlPoints() {
        this.controlPoints = {p1: null, p2: null, p3: null, p4: null};
    }

    _updateCanvas(e) {
        const vControlPoints = this._getVisualControlPoints(e); // For visualization

        this.editorContext.updateCanvas();
        this.editorContext._drawBezier(Object.values(vControlPoints), true, "black", this.curveState);

        // Drawing tool icon
        this._drawIcon(e);
    }
}