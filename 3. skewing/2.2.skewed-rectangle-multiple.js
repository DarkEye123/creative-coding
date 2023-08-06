const canvasSketch = require("canvas-sketch");
const math = require("canvas-sketch-util/math");
const rand = require("canvas-sketch-util/random");

const settings = {
  //good for instagram
  dimensions: [1080, 1080],
  maxRectangles: 25,
};

const sketch = ({ width, height }) => {
  const rectangles = [];

  for (let x = 0; x < settings.maxRectangles; ++x) {
    const x = rand.range(0, width);
    const y = rand.range(0, height);
    const w = rand.range(200, 600);
    const h = rand.range(100, 250);
    // const angle = rand.range(10, 45);
    const angle = -30;
    rectangles.push({ x, y, w, h, angle });
  }

  return ({ context, width, height }) => {
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);

    context.save();
    context.strokeStyle = "blue";

    rectangles.forEach((rectangle) => {
      drawSkewedRectangle(context, rectangle);
    });

    context.restore();
  };
};

const drawSkewedRectangle = (context, rectangle) => {
  context.save();
  context.translate(rectangle.x, rectangle.y);
  const angleInRad = math.degToRad(rectangle.angle);

  const rx = Math.cos(angleInRad) * rectangle.w;
  const ry = Math.sin(angleInRad) * rectangle.w;

  context.translate(rx * -0.5, (ry + rectangle.h) * -0.5);

  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(rx, ry);
  context.lineTo(rx, ry + rectangle.h);
  context.lineTo(0, rectangle.h);
  context.closePath();

  //draw it
  context.stroke();

  context.restore();
};

canvasSketch(sketch, settings);
