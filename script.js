import { EditorContext } from "./js/EditorContext.js";

// Initializing the canvas
const CANVAS_SIZE = [800, 800];
const canvas = document.getElementById("canvas");

canvas.setAttribute("width", CANVAS_SIZE[0]);
canvas.setAttribute("height", CANVAS_SIZE[1]);

// Initializing the editor context
const editorContext = new EditorContext(canvas);
editorContext.init();

// Assigning the buttons
const selectToolBtn = document.getElementById("select-tool-btn");
const curveToolBtn = document.getElementById("curve-tool-btn");
selectToolBtn.addEventListener("click", () => {
    console.log("Outil Sélection");
    editorContext.useTool(editorContext.SELECT_TOOL);
});
curveToolBtn.addEventListener("click", () => {
    console.log("Outil Plume");
    editorContext.useTool(editorContext.CURVE_TOOL);
});