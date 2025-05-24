const removeEles = function(query, ancestor = document) {
  let els = ancestor.querySelectorAll(query);

  for( let i = 0; i < els.length; i++ ){
    let el = els[i];

    el.parentNode.removeChild(el);
  }
};

const setStyles = function(el, style) {
  let props = Object.keys(style);

  for (let i = 0, l = props.length; i < l; i++) {
    el.style[props[i]] = style[props[i]];
  }
};

const createElement = function(options){
  options = options || {};

  let el = document.createElement(options.tag || 'div');

  el.className = options.class || '';

  if (options.style) {
    setStyles(el, options.style);
  }

  return el;
};

const getPixelRatio = function(){
  return window.devicePixelRatio || 1;
};

const getOffset = function(el){
  let offset = el.getBoundingClientRect();

  return {
    left: offset.left + document.body.scrollLeft +
          parseFloat(getComputedStyle(document.body)['padding-left']) +
          parseFloat(getComputedStyle(document.body)['border-left-width']),
    top: offset.top + document.body.scrollTop +
         parseFloat(getComputedStyle(document.body)['padding-top']) +
         parseFloat(getComputedStyle(document.body)['border-top-width'])
  };
};

const createArc = function (
    ctx, center, radius,
    startAngle, endAngle,
    fillStyle = '',
    counterClockwise = true,
    closePath = true,
    location = true,
    strokeStyle = '',
    lineWidth = 1,
    strokeOutside = false,
) {
  ctx.beginPath();
  if (location) {
    ctx.moveTo(center.x, center.y);
  }
  ctx.arc(center.x, center.y, radius, startAngle, endAngle, counterClockwise);
  if (fillStyle) {
    ctx.fillStyle = fillStyle;
    ctx.fill();
  }
  if (strokeStyle && !strokeOutside) {
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }
  if (closePath) {
    ctx.closePath();
  }
};

// Clear an arc area using composite mode
const clearArc = function (
    ctx, center, radius,
    startAngle, endAngle,
    counterClockwise = true,
    closePath = true,
    location = true,
) {
  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  if (location) {
    ctx.moveTo(center.x, center.y);
  }
  ctx.arc(center.x, center.y, radius, startAngle, endAngle, counterClockwise);
  if (closePath) {
    ctx.closePath();
  }
  ctx.fill();
  ctx.globalCompositeOperation = 'source-over';
};

// Utility: draw arc with stroke on canvas
const createArcWithStroke = function (
    ctx, center, radius, lineWidth,
    startAngle, endAngle,
    strokeStyle,
    counterClockwise = true,
    closePath = true,
) {
  ctx.strokeStyle = strokeStyle;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.arc(center.x, center.y, radius, startAngle, endAngle, counterClockwise);
  ctx.stroke();
  if (closePath) {
    ctx.closePath();
  }
};

// Utility: clear arc with stroke on canvas
const clearArcWithStroke = function (
    ctx, center, radius, lineWidth,
    startAngle, endAngle,
    counterClockwise = true,
    closePath = true,
) {
  ctx.globalCompositeOperation = 'destination-out';
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.arc(center.x, center.y, radius, startAngle, endAngle, counterClockwise);
  ctx.stroke();
  if (closePath) {
    ctx.closePath();
  }
  ctx.globalCompositeOperation = 'source-over';
};

// Draw a line between two points
const createLine = function (
    ctx, startPoint, endPoint,
    lineWidth = 1, strokeStyle = 'black',
    closePath = true
) {
  ctx.strokeStyle = strokeStyle;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.moveTo(startPoint.x, startPoint.y);
  ctx.lineTo(endPoint.x, endPoint.y);
  ctx.stroke();
  if (closePath) {
    ctx.closePath();
  }
};

// Clear a line by overdrawing with destination-out
const clearLine = function (
    ctx, startPoint, endPoint,
    lineWidth = 1, strokeStyle = 'black',
    closePath = true
) {
  ctx.globalCompositeOperation = 'destination-out';
  createLine(ctx, startPoint, endPoint, lineWidth, strokeStyle, closePath);
  ctx.globalCompositeOperation = 'source-over';
};

// Draw a rect between two points
const createRect = function (ctx, startPoint, width, height, translate, rotate, fillStyle) {
  ctx.fillStyle = fillStyle;
  ctx.translate(translate.x, translate.y);
  ctx.rotate(rotate);

  ctx.beginPath();
  ctx.fillRect(startPoint.x, startPoint.y, width, height);
  ctx.closePath();
  ctx.fill();

  ctx.rotate(-rotate);
  ctx.translate(-translate.x, -translate.y);
}

// Clear a rect by overdrawing with destination-out
const clearRect = function (ctx, startPoint, width, height, translate, rotate, fillStyle) {
  ctx.globalCompositeOperation = 'destination-out';
  ctx.fillStyle = fillStyle;
  ctx.translate(translate.x, translate.y);
  ctx.rotate(rotate);

  ctx.beginPath();
  ctx.fillRect(startPoint.x, startPoint.y, width, height);
  ctx.closePath();
  ctx.fill();

  ctx.rotate(-rotate);
  ctx.translate(-translate.x, -translate.y);
  ctx.globalCompositeOperation = 'source-over';
}

function createBorder(ctx,centerX,centerY,radius,arcStart,arcEnd,strokeStyle = "white",lineWidth = 1,closePath = true,counterClockwise = true) {
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, arcStart, arcEnd,counterClockwise);
  ctx.strokeStyle = strokeStyle;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
  if (closePath) {
    ctx.closePath();
  }
}

module.exports = { removeEles, setStyles, createElement, getPixelRatio, getOffset, createArc, clearArc, createLine, clearLine, clearArcWithStroke, createArcWithStroke, clearRect, createRect, createBorder };
