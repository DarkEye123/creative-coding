const canvasSketch = require("canvas-sketch");

const settings = {
  dimensions: [1080, 1080],
};

const sketch = () => {
  const points = [
    new Point(200, 500),
    new Point(300, 200, true),
    new Point(800, 500),
  ];
  return ({ context, width, height }) => {
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);

    const [startPoint, controlPoint, endPoint] = points;

    context.save();
    context.beginPath();
    context.moveTo(startPoint.x, startPoint.y);
    context.quadraticCurveTo(
      controlPoint.x,
      controlPoint.y,
      endPoint.x,
      endPoint.y
    );
    context.stroke();
    points.forEach((point) => point.draw(context));

    context.restore();
  };
};

class Point {
  constructor(x, y, control = false) {
    this.x = x;
    this.y = y;
    this.control = control;
  }

  draw(context) {
    context.save();
    context.translate(this.x, this.y);
    context.beginPath();
    context.fillStyle = this.control ? "red" : "black";
    context.arc(0, 0, 10, 0, Math.PI * 2); // circle
    context.fill();
    context.restore();
  }
}

canvasSketch(sketch, settings);
