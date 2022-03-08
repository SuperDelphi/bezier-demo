# bezier-demo

[Version française](https://github.com/SuperDelphi/bezier-demo/blob/master/README.fr.md)

This is a simple demo of a bezier curve editor on an HTML canvas. You can access a live demo [here](https://frenchforge.fr/bezier).

*Note: This tool is made solely for educational purposes. It just adds... curves. That's all.*

## How to use it

### Accessing the app

1. Download the repository.
2. Open the ``index.html`` file into your favorite web browser *(you don't need a web server for this to work properly)*.
3. And you're good to go!

### Adding a curve

By default, the editor is using the *Curve tool*, which lets you add [Bézier curves](https://en.wikipedia.org/wiki/B%C3%A9zier_curve) to the canvas.

To add a curve, simply left-click (without releasing the button), drag the mouse somewhere else then release the button. With this, you added:
- The first end of the curve
- The first control point (indicated by a blue handle), making the curve shape.

Finally, to finish the curve, repeat the operation (left-click, drag and release).

*Note: If you're not satisfied with the curve position or shape, you can right-click at any time before finishing the curve to cancel the operation.*

### Adding a straight line

With the *Curve tool*, simply left-click somewhere without dragging the mouse, then left-click somewhere else to finish the line.

*Note: Behind the scenes, you're adding a Bézier curve where the control points have the same coordinates as the endpoints, thus making a straight line.*

### Editing a curve

The *Select tool* lets you edit curve endpoints. In order to do this, make sure you have selected the tool by clicking on the "Select tool" button.

To edit an endpoint, simply left-click then drag one of them to the location you want.

*Note: For the moment, it is not yet possible to move the control points.*
