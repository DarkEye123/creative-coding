const canvasSketch = require("canvas-sketch");
const math = require("canvas-sketch-util/math");
const rand = require("canvas-sketch-util/random");
const canvasColor = require("canvas-sketch-util/color");
const risoColors = require("riso-colors");

const settings = {
  //good for instagram
  dimensions: [1080, 1080],
  maxRectangles: 40,
  defaultAngleInDegrees: -30,
};

const sketch = ({ width, height }) => {
  const rectangles = [];
  const risoColorList = [rand.pick(risoColors).hex, rand.pick(risoColors).hex];
  const bgColor = rand.pick(risoColors).hex;

  for (let x = 0; x < settings.maxRectangles; ++x) {
    const x = rand.range(0, width);
    const y = rand.range(0, height);
    const w = rand.range(400, 800);
    const h = rand.range(100, 250);
    const angle = settings.defaultAngleInDegrees;
    //https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
    // in the video is overlay but I couldn't find any info about it, here it is some universal function to test other modes
    // https://stackoverflow.com/questions/33955992/js-how-to-get-list-of-supported-html-canvas-globalcompositeoperation-types
    const blend = rand.value() > 0.5 ? "overlay" : "source-over";

    const fill = rand.pick(risoColorList);
    const stroke = rand.pick(risoColorList);
    const shadow = canvasColor.offsetHSL(fill, 0, 0, -20);
    shadow.rgba[3] = 0.5;
    const shadowStyled = canvasColor.style(shadow.rgba);

    rectangles.push({
      x,
      y,
      w,
      h,
      angle,
      fill,
      stroke,
      shadow: shadowStyled,
      blend,
    });
  }

  return ({ context, width, height }) => {
    context.fillStyle = bgColor;
    context.fillRect(0, 0, width, height);

    context.save();

    rectangles.forEach((rectangle) => {
      // shadowColor is applied for `fill` and `stroke`
      context.save();
      context.shadowColor = rectangle.shadow;
      context.shadowOffsetX = -10;
      context.shadowOffsetY = 20;

      context.fillStyle = rectangle.fill;
      context.strokeStyle = rectangle.stroke;
      context.lineWidth = 10;

      drawSkewedRectangle(context, rectangle);

      //https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
      context.globalCompositeOperation = rectangle.blend;

      context.fill();
      // shadowColor is applied for `fill` and `stroke`, I want shadow just for the fill
      context.shadowColor = null;
      //draw borders
      context.stroke();

      // this will make that slim black line
      context.lineWidth = 2;
      context.strokeStyle = "black";
      context.stroke();
      context.restore();
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

  context.restore();
};

canvasSketch(sketch, settings);
