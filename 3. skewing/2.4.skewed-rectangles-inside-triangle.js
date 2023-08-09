const canvasSketch = require("canvas-sketch");
const math = require("canvas-sketch-util/math");
const rand = require("canvas-sketch-util/random");
const canvasColor = require("canvas-sketch-util/color");
const risoColors = require("riso-colors");

const settings = {
  //good for instagram
  dimensions: [1080, 1080],
  // animate: true,
  maxRectangles: 40,
  defaultAngleInDegrees: -30,
};

const sketch = ({ context, width, height }) => {
  const rectangles = [];
  const risoColorList = [rand.pick(risoColors).hex, rand.pick(risoColors).hex];
  const bgColor = rand.pick(risoColors).hex;

  //used purely for removal of redundancy, original case from tutorial differs - I didn't need to translate rectangles in a way as he did
  const mask = {
    x: width * 0.5,
    y: height * 0.5,
    radius: 400,
    sides: 3,
  };

  for (let x = 0; x < settings.maxRectangles; ++x) {
    const x = rand.range(0, width);
    const y = rand.range(0, height);
    const w = rand.range(400, 800);
    const h = rand.range(100, 250);
    const angle = settings.defaultAngleInDegrees;
    //https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
    // in the video is overlay but I couldn't find any info about it, here it is some universal function to test other modes
    // https://stackoverflow.com/questions/33955992/js-how-to-get-list-of-supported-html-canvas-globalcompositeoperation-types
    // https://developer.mozilla.org/en-US/docs/Web/CSS/blend-mode
    // https://drafts.fxtf.org/compositing/#ltblendmodegt
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
    context.translate(mask.x, mask.y);
    drawPolygon({ context, radius: mask.radius, sides: mask.sides });

    // the restore before will ensure that my rectangles will be visible "OK"
    // in the tutorial he is positioning them manually, IMO not needed by doing this
    context.restore();

    // path shaped into triangle
    context.clip();
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

    /**
     * This part is used 'after' shapes are drawn to draw black triangle border with "color-burn", which inverts the bottom color and divides the color by top color and invert that value from it
     */
    context.save();
    context.translate(mask.x, mask.y);
    // https://developer.mozilla.org/en-US/docs/Web/CSS/blend-mode
    context.globalCompositeOperation = "color-burn";
    drawPolygon({ context, radius: mask.radius - 10, sides: mask.sides });

    context.lineWidth = 20;
    context.strokeStyle = "black";
    context.stroke();
    context.restore();
  };
};

const drawPolygon = ({ context, radius = 100, sides = 3 }) => {
  const slice = (Math.PI * 2) / sides;

  context.save();

  context.beginPath();
  context.moveTo(0, -radius);
  // closePath is the closing line, thus starting at 1,
  //starting with 0 will make computation problems
  // - Math.PI * 0.5 will ensure 90 degrees rotation
  for (let i = 1; i < sides; ++i) {
    const theta = i * slice - Math.PI * 0.5; // imagine circle within I draw N sided shape -- in this case triangle. theta is one of the points -- talking about symmetrical triangle
    context.lineTo(Math.cos(theta) * radius, Math.sin(theta) * radius);
  }
  context.closePath();

  context.restore();
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
