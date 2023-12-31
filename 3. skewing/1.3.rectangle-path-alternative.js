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
    context.translate(w * -0.5, h * -0.5);

    // context.strokeRect(w * -0.5, h * -0.5, w, h);

    context.strokeStyle = "blue";
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(w, 0);
    context.lineTo(w, h);
    context.lineTo(0, h);
    // closePath is same as context.lineTo(0, 0); in this case
    context.closePath();

    //draw it
    context.stroke();

    context.restore();
  };
};
canvasSketch(sketch, settings);
