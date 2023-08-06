const canvasSketch = require("canvas-sketch");

const settings = {
  //good for instagram
  dimensions: [1080, 1080],
};

const sketch = () => {
  let x, y, w, h;
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
    context.strokeRect(w * -0.5, h * -0.5, w, h);
  };
};
canvasSketch(sketch, settings);
