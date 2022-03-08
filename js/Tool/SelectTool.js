import { Tool } from "./Tool.js";

import { Point } from "../Point.js";

export class SelectTool extends Tool {
    mousedown_handler(e) {
        this._updateCanvas(e);

        // Grabs the "nearest" point
        const mPoint = this._getMagnetPoint(e);
        if (mPoint) {
            this.grabbingPoint = mPoint;

            this.editorContext._drawPoint(new Point(mPoint.x, mPoint.y),
            this.editorContext.S_POINT_STROKE,
            this.editorContext.S_POINT_FILL,
            this.editorContext.S_POINT_SIZE
            );

            this._drawIcon(e);
        }
    }
    mouseup_handler(e) {
        this._updateCanvas(e);

        // Releases the grabbed point
        if (this.grabbingPoint) {
            this.editorContext._drawPoint(new Point(this.grabbingPoint.x, this.grabbingPoint.y), this.editorContext.H_POINT_STROKE, this.editorContext.H_POINT_FILL, this.editorContext.H_POINT_SIZE);
            this._drawIcon(e);

            this.grabbingPoint = undefined;
        }
    }
    mousemove_handler(e) {
        this._updateCanvas(e);

        // If currently grabbing a point
        if (this.grabbingPoint) {
            const coords = this._getRelativeMousePos(this.canvas, e);

            // Changes point's coordinates
            this.grabbingPoint.x = coords.x;
            this.grabbingPoint.y = coords.y;

            // Draws the point accordingly
            this.editorContext._drawPoint(new Point(this.grabbingPoint.x, this.grabbingPoint.y), this.editorContext.S_POINT_STROKE, this.editorContext.S_POINT_FILL, this.editorContext.S_POINT_SIZE);

            this._drawIcon(e);
        } else {
            // Shows the "nearest" point for the mouse
            const mPoint = this._getMagnetPoint(e);
            if (mPoint) {
                this.editorContext._drawPoint(new Point(mPoint.x, mPoint.y), this.editorContext.H_POINT_STROKE, this.editorContext.H_POINT_FILL, this.editorContext.H_POINT_SIZE);
                this._drawIcon(e);
            }
        }
        
    }

    events = {
        "mousedown": this.mousedown_handler.bind(this),
        "mouseup": this.mouseup_handler.bind(this),
        "mousemove": this.mousemove_handler.bind(this)
    }

    ICON_PATH = "img/select_tool.png";
    MAGNET_RADIUS = 15;
    grabbingPoint;

    constructor(editorContext, canvas) {
        super(editorContext, canvas);
    }

    _getMagnetPoint(e) {
        // TODO: Improve later (nearest magnet point?)

        const coords = this._getRelativeMousePos(this.canvas, e);
        const points = this.editorContext.points;

        let magnetPoint;
        let i = 0;

        while (i < points.length && !magnetPoint) {
            const p = points[i];
            const distance = Math.sqrt(Math.pow((p.x - coords.x), 2) + Math.pow((p.y - coords.y), 2));
            if (distance < this.MAGNET_RADIUS) magnetPoint = p;
            i++;
        }

        return magnetPoint;
    }

    _updateCanvas(e) {
        this.editorContext.updateCanvas();
        this._drawIcon(e);
    }
}