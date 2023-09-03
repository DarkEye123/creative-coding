const canvasSketch = require("canvas-sketch");

const settings = {
  dimensions: [1080, 1080],
};

class Point {
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
}

const points = [];

const sketch = ({ width, height }) => {
  const columns = 12;
  const rows = 6;
  const pointsCount = columns * rows;
  const gridWidth = width * 0.8;
  const gridHeight = height * 0.8;
  const cellWidth = gridWidth / columns;
  const cellHeight = gridHeight / rows;
  const marginX = (width - gridWidth) * 0.5;
  const marginY = (height - gridHeight) * 0.5;

  return ({ context, width, height }) => {
    context.save();
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);

    context.translate(cellWidth * 0.5, cellHeight * 0.5);

    context.save();
    context.beginPath();
    // this will center the lines (points)
    for (let index = 0; index < pointsCount; ++index) {
      const x = (index % columns) * cellWidth + marginX;
      const y = Math.floor(index / columns) * cellHeight + marginY;
      const point = new Point(x, y);
      point.draw(context);
      points.push(point);
    }
    context.restore();

    context.save();
    context.lineWidth = 2;
    context.strokeStyle = "#999";
    for (let index = 0; index < points.length - 1; ++index) {
      const currentPoint = points[index];
      const nextPoint = points[index + 1];

      if (index % columns === 0) {
        context.beginPath();
        context.moveTo(currentPoint.x, currentPoint.y);
        if (index > 0) {
          context.stroke();
        }
      } else if (index % columns === columns - 1) {
        context.quadraticCurveTo(
          currentPoint.x,
          currentPoint.y,
          nextPoint.x,
          nextPoint.y
        );
      } else {
        const mx = nextPoint.x - (nextPoint.x - currentPoint.x) * 0.5;
        const my = nextPoint.y - (nextPoint.y - currentPoint.y) * 0.5;
        context.quadraticCurveTo(currentPoint.x, currentPoint.y, mx, my);
      }
    }

    context.restore();

    context.restore();
  };
};

canvasSketch(sketch, settings);
