class Point {
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

class BezierCurve {
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

class Tool {
    events = {};

    ICON_PATH;
    icon;
    editorContext;
    canvas;

    constructor(editorContext, canvas) {
        this.editorContext = editorContext;
        this.canvas = canvas;
    }

    mount() {
        // Mounting the events
        Object.keys(this.events).forEach(name => {
            this.canvas.addEventListener(name, this.events[name]);
        });
    }

    unmount() {
        // Unmounting the events
        Object.keys(this.events).forEach(name => {
            this.canvas.removeEventListener(name, this.events[name]);
        })
    }

    _updateCanvas(e) {
        this.editorContext.updateCanvas();
    }

    _drawIcon(e) {
        if (!this.icon) {
            this.icon = new Image(32, 32);
            this.icon.src = this.ICON_PATH;
        } else {
            const ctx = canvas.getContext("2d");
            const coords = this._getRelativeMousePos(this.canvas, e);
            ctx.drawImage(this.icon, coords.x, coords.y);
        }
    }

    _getRelativeMousePos(element, event) {
        const rect = element.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    };
}

class SelectTool extends Tool {
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

class CurveTool extends Tool {
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

class EditorContext {
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