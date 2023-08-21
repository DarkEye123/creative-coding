const canvasSketch = require("canvas-sketch");

const settings = {
  dimensions: [1080, 1080],
  animate: true,
};

class Point {
  static MAX_DISTANCE = 20;
  static selectedPoint = null;
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

  isHit(canvas, x, y) {
    const [scaledX, scaledY] = computeScaledCoordinates(canvas, x, y);

    const distance = Math.pow(
      Math.pow(scaledX - this.x, 2) + Math.pow(scaledY - this.y, 2),
      0.5
    );

    return distance <= Point.MAX_DISTANCE;
  }
}

const points = [
  new Point(200, 500),
  new Point(300, 200, true),
  new Point(800, 500),
];

function computeScaledCoordinates(canvas, x, y) {
  const rectObject = canvas.getClientRects()[0];
  const currentCanvasWidth = rectObject.width;
  const currentCanvasHeight = rectObject.height;
  const scaledX = settings.dimensions[0] / (currentCanvasWidth / x);
  const scaledY = settings.dimensions[1] / (currentCanvasHeight / y);
  return [scaledX, scaledY];
}

const sketch = ({ canvas }) => {
  canvas.addEventListener("mousedown", handleMouseDown);
  canvas.addEventListener("mouseup", handleMouseUp);
  canvas.addEventListener("mousemove", handleMouseOverPoint);

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

canvasSketch(sketch, settings);
const coordDiv = document.createElement("div");

function handleMouseUp() {
  Point.selectedPoint = null;
}

function handleMouseDown(e) {
  let hit = false;
  points.forEach((point) => {
    const localHit = point.isHit(e.target, e.offsetX, e.offsetY);
    if (localHit) {
      Point.selectedPoint = point;
    }
    hit = hit || localHit;
  });

  if (hit) {
    document.body.style.cursor = "grab";
  } else {
    document.body.style.cursor = "auto";
  }
}

function handleMouseOverPoint(e) {
  const [scaledX, scaledY] = computeScaledCoordinates(
    e.target,
    e.offsetX,
    e.offsetY
  );
  coordDiv.textContent = `x: ${scaledX}, y: ${scaledY}`;

  let hit = false || !!Point.selectedPoint;

  if (!Point.selectedPoint) {
    points.forEach((point) => {
      hit = hit || point.isHit(e.target, e.offsetX, e.offsetY);
    });
  } else {
    Point.selectedPoint.x = scaledX;
    Point.selectedPoint.y = scaledY;
  }

  if (Point.selectedPoint) {
    document.body.style.cursor = "grabbing";
  } else if (hit) {
    document.body.style.cursor = "grab";
  } else {
    document.body.style.cursor = "auto";
  }
}

document.body.appendChild(coordDiv);
document.body.style.display = "grid";

// window.addEventListener("mousemove", handleMouseOverPoint);
// window.addEventListener("mousedown", handleMouseOverPoint);
