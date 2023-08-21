const canvasSketch = require("canvas-sketch");

const settings = {
  dimensions: [1080, 1080],
  animate: true,
};

class Point {
  static MAX_DISTANCE = 20;
  static selectedPoint = null;
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  draw(context) {
    context.save();
    context.translate(this.x, this.y);
    context.beginPath();
    context.fillStyle = "black";
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
  new Point(300, 200),
  new Point(800, 500),
  new Point(900, 300),
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
    let [firstPoint, ...restPoints] = points;

    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);

    context.save();

    context.lineWidth = 1;
    context.strokeStyle = "#999";
    context.beginPath();
    context.moveTo(firstPoint.x, firstPoint.y);

    for (let index = 0; index < restPoints.length; ++index) {
      context.lineTo(restPoints[index].x, restPoints[index].y);
    }

    context.stroke();
    context.restore();

    context.save();
    context.lineWidth = 4;
    context.strokeStyle = "blue";
    context.beginPath();
    context.moveTo(firstPoint.x, firstPoint.y);
    for (let index = 0; index < restPoints.length - 1; ++index) {
      const current = restPoints[index];
      const next = restPoints[index + 1];

      const mx = next.x - (next.x - current.x) * 0.5;
      const my = next.y - (next.y - current.y) * 0.5;

      context.quadraticCurveTo(current.x, current.y, mx, my);
    }

    context.stroke();
    context.restore();

    points.forEach((point) => point.draw(context));
  };
};

canvasSketch(sketch, settings);
const coordDiv = document.createElement("div");

function handleMouseUp() {
  Point.selectedPoint = null;
}

function handleMouseDown(e) {
  const [scaledX, scaledY] = computeScaledCoordinates(
    e.target,
    e.offsetX,
    e.offsetY
  );
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
    points.push(new Point(scaledX, scaledY));
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
