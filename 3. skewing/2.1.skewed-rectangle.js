const canvasSketch = require("canvas-sketch");
const math = require("canvas-sketch-util/math");

const settings = {
  //good for instagram
  dimensions: [1080, 1080],
};

const sketch = () => {
  let x, y, w, h;
  let angleInDeg = 30;

  return ({ context, width, height }) => {
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);

    x = width * 0.5;
    y = height * 0.5;
    w = width * 0.6;
    h = width * 0.1;
    context.save();
    context.translate(x, y);
    context.strokeStyle = "blue";

    drawSkewedRectangle(context, angleInDeg, w, h);

    context.restore();
  };
};

const drawSkewedRectangle = (context, angleInDeg = 30, w, h) => {
  context.save();
  const angleInRad = math.degToRad(angleInDeg);

  const rx = Math.cos(angleInRad) * w;
  const ry = Math.sin(angleInRad) * w;

  context.translate(rx * -0.5, (ry + h) * -0.5);

  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(rx, ry);
  context.lineTo(rx, ry + h);
  context.lineTo(0, h);
  context.closePath();

  //draw it
  context.stroke();

  context.restore();
};

canvasSketch(sketch, settings);
