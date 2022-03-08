export class Tool {
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