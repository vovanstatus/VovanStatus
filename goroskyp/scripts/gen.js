// DEBUGGING
var genDebug = 1;
function setDebug(_val = 1)
{
	genDebug = _val;
}

function logDebug(toLog)
{
	if (genDebug)
  {
  	console.log(toLog)
  }
}

// UTILS
function shuffle(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function getCenterAlignedStartPointsForObjectRendering(canvasSize, objectSizeArray, objInterval = 5)
{
	if (objectSizeArray.length == 0)
  {
  	return [0];
  }
	var allObjectsSize = 0;
	for (var i = 0; i < objectSizeArray.length; i++)
  {
  	allObjectsSize = allObjectsSize + objectSizeArray[i] + objInterval;
  }
  allObjectsSize = allObjectsSize == 0 ? allObjectsSize : allObjectsSize - objInterval;
  var startingPoint = canvasSize / 2 - allObjectsSize / 2;
  var resultArray = [];
  for (var i = 0; i < objectSizeArray.length; i++)
  {
  	resultArray.push(startingPoint);
    startingPoint = startingPoint + objectSizeArray[i] + objInterval;
  }
  return resultArray;
}

// globals
var titleInputElementId = "titleInp";
var namesInputElementId = "namesInp";
var valuesInputElementId = "valuesInp";
var footerInputElementId = "footerInp";
var footerImageInputElementId = "footerImageInp";
var backgroundImageInputElementId = "backgroundImageInp";

var generatedImageElementId = "generatedImage";

var maxPreFooterTextImageWidth = 100;
var maxPreFooterTextImageHeight = 75;

var maxPreFooterTextImageWidthPercentage = 0.095;
var maxPreFooterTextImageHeightPercentage = 0.070;

// gen
class InputAccessor
{
  static getShuffledValuesOfInput(id)
  {
  	return shuffle(InputAccessor.getValuesOfInput(id));
  }
  static getValuesOfInput(id)
  {
    	return document.getElementById(id).value.split("\n");
  }
}

class InputGetter
{
  static getTitle()
  {
  	return InputAccessor.getValuesOfInput(titleInputElementId);
  }
  static getShuffledNames()
  {
  	return InputAccessor.getShuffledValuesOfInput(namesInputElementId);
  }
  static getShuffledValues()
  {
  	return InputAccessor.getShuffledValuesOfInput(valuesInputElementId);
  }
  static getNames()
  {
  	return InputAccessor.getValuesOfInput(namesInputElementId);
  }
  static getValues()
  {
  	return InputAccessor.getValuesOfInput(valuesInputElementId);
  }
  static getFooter()
  {
  	return InputAccessor.getValuesOfInput(footerInputElementId);
  }
  static getFooterImageSrc()
  {
  	return InputAccessor.getValuesOfInput(footerImageInputElementId);
  }
  static getBackgroundImageSrc()
  {
                return InputAccessor.getValuesOfInput(backgroundImageInputElementId);
  }
  static getShuffledNameValueStringArray()
  {
  	var names = InputGetter.getShuffledNames();
    var values = InputGetter.getValues();
    if (names == null || values == null)
    {
    	return null;
    }
    if (values.length < names.length)
    {
      values =
      	values.concat(new Array(names.length - values.length)).fill(0, values.length, names.length);
    }
    values = shuffle(values);
    return names.map(function (element, index) { return element + ": " + values[index]});
  }
}

class Coordinates
{
  constructor(_x, _y) { this.x = _x; this.y = _y;}
}

class Size
{
  constructor(_width, _height) { this.width = _width; this.height = _height; }
}

class CanvasFont
{
  constructor(_size = 10, _fontFamily = "serif", _additionalParams = "")
  {
  	this.size = _size >= 0 ? _size : 0;
    this.fontFamily = _fontFamily;
    this.additionalParams = _additionalParams;
  }
  getCanvasCtxFontString()
  {
  	return (this.additionalParams == "" ? "" : (this.additionalParams + " ")) +
    	this.size + "px" + " " +
      "\"" + this.fontFamily + "\"";//if [0] = \" and [last] = \" check should be added
  }
}

class CanvasText
{
  constructor(_lines,
	      _color,
              _startingPoint,
              _newLineHeightShift,
              _canvasFont)
  {
    this.lines = _lines;
    this.color = _color;
    this.startingPoint = _startingPoint;
    this.newLineHeightShift = _newLineHeightShift;
    this.font = _canvasFont;
  }
  
  fillIntoCanvasCtx(ctx)
  {
  	//save prev
    this.storeCanvasSettings(ctx);
    
    this.setTitleCanvasSettingToContext(ctx);
    
    for (var i = 0; i < this.lines.length; i++)
    {
      ctx.fillText(this.lines[i],
                	this.startingPoint.x,
               		this.startingPoint.y + i * this.newLineHeightShift);
    }
    
    //restore
    this.restoreCanvasSettingsToContext(ctx);
  }
  
  storeCanvasSettings(ctx)
  {
    this.oldFont = ctx.font;
    this.oldFillStyle = ctx.fillStyle
  }
  
  restoreCanvasSettingsToContext(ctx)
  {
    ctx.font = this.oldFont != null ? this.oldFont : ctx.font;
    ctx.fillStyle = this.oldFillStyle != null ? this.oldFillStyle : ctx.fillStyle;
    this.oldFont = null;
    this.oldFillStyle = null;
  }
  
  setTitleCanvasSettingToContext(ctx)
  {
    ctx.font = this.font.getCanvasCtxFontString();
    ctx.fillStyle = this.color;
  }
  setLines(lines)
  {
	  this.lines = lines;
  }
}

class TitleText extends CanvasText
{
  constructor(_lines,
  	      _color = "black",
              _startingPoint = new Coordinates(60, 110),
              _newLineHeightShift = 52 * 1.1,
              _canvasFont = new CanvasFont(52, "Comic Sans MS", "bold"))
  {
    super(_lines, _color, _startingPoint, _newLineHeightShift, _canvasFont)
  }
}

class BodyText extends CanvasText
{
  constructor(_lines,
  	      _textAlign = "center",
	      _autoAdjustFontSize = true,
  	      _color = "black",
              _startingPoint = new Coordinates(500, 400),
              _newLineHeightShift = 72 * 1.1,
              _canvasFont = new CanvasFont(72, "Segoe UI", "italic"))
  {
    super(_lines, _color, _startingPoint, _newLineHeightShift, _canvasFont)
    this.textAlign = _textAlign;
    this.autoAdjustFontSize = _autoAdjustFontSize;
    this.originalFontSize = this.font.size;
    this.setLines(this.lines);
  }
  
  storeCanvasSettings(ctx)
  {
    this.oldTextAlign = ctx.textAlign;
    super.storeCanvasSettings(ctx);
  }
  
  restoreCanvasSettingsToContext(ctx)
  {
    ctx.textAlign = this.oldTextAlign;
    super.restoreCanvasSettingsToContext(ctx);
    this.oldTextAlign = null;
  }
  
  setTitleCanvasSettingToContext(ctx)
  {
    ctx.textAlign = this.textAlign;
    super.setTitleCanvasSettingToContext(ctx);
  }
  setLines(lines, autoAdjustFontSize = this.autoAdjustFontSize)
  {
	  var resultLines = [];
	  for (var i = 0; i < lines.length; i++)
	  {
		  resultLines = resultLines.concat(lines[i].split("\\\\"));
	  }
	  this.lines = resultLines;
	  if (autoAdjustFontSize && (resultLines.length > 8)) // TODO use const
	  {
		  this.font.size = Math.round(this.originalFontSize * resultLines.length / 8); // TODO: use const
		  this.newLineHeightShift = this.font.size * 1.1; // TODO: use const
	  }
  }
}

class FooterText extends CanvasText
{
  constructor(_lines,
  	      _color = "black",
              _startingPoint = new Coordinates(500, 1010),
              _newLineHeightShift = 30 * 1.1,
              _canvasFont = new CanvasFont(30, "Comic Sans MS"))
  {
    super(_lines, _color, _startingPoint, _newLineHeightShift, _canvasFont)
  }
}

class Renderable
{
  renderToCanvasCtx(ctx) {}
}

class CanvasTitle extends Renderable
{
  constructor(lines, ctx)
  {
    super();
    this.text = new TitleText(lines);
  }
  renderToCanvasCtx(ctx)
  {
    this.text.fillIntoCanvasCtx(ctx);
  }
}

class CanvasBody extends Renderable
{
  constructor(lines, ctx)
  {
    super();
    this.text = new BodyText(lines, "center");
    this.text.startingPoint.x = ctx.canvas.width / 2;
    this.text.startingPoint.y = ctx.canvas.height / 2 - ((this.text.lines.length - 1) * this.text.font.size / 2);
  }
  renderToCanvasCtx(ctx)
  {
    this.text.fillIntoCanvasCtx(ctx);
  }
}

class CanvasFooter extends Renderable
{
	constructor(lines, ctx, preTextImageSrc = null)
  {
    super();
    this.text = new FooterText(lines);
    this.preTextImage = null;
    if (preTextImageSrc != null)
    {
      this.preTextImage = new Image();
      this.preTextImage.setAttribute('crossorigin', 'anonymous'); 
      this.onload = this.preTextImageLoaded; // doesn't work
      this.preTextImage.src = preTextImageSrc;
    }
  }
  
  shrinkImage()
  {
    if (this.preTextImage == null)
    {
      return;
    }
    if (this.preTextImage.height > maxPreFooterTextImageHeight ||
    	this.preTextImage.width > maxPreFooterTextImageWidth)
    {
      var multiplier = this.preTextImage.height >= this.preTextImage.width ?
      	maxPreFooterTextImageHeight / this.preTextImage.height :
      	maxPreFooterTextImageWidth / this.preTextImage.width;
      this.preTextImage.height = this.preTextImage.height * multiplier;
      this.preTextImage.width = this.preTextImage.width * multiplier;
      logDebug("Shrinked image to: " + this.preTextImage.width + "x" + this.preTextImage.height);
    }
  }
  
  preTextImageLoaded()
  {
  	logDebug("preTextImageLoaded()")
    //this.shrinkImage();
  }
  
  renderToCanvasCtx(ctx)
  {
    if (this.preTextImage != null)
    {
      this.shrinkImage();
      this.text.storeCanvasSettings(ctx);
      this.text.setTitleCanvasSettingToContext(ctx);
      // futureproofing
      var textWidth = 0;
      for (var i = 0; i < this.text.lines.length; i++)
      {
      	var tmp = ctx.measureText(this.text.lines[i]).width;
        textWidth = textWidth < tmp ? tmp : textWidth;
      }
      logDebug("Starting points: " + textWidth);
      //
      this.text.restoreCanvasSettingsToContext(ctx);
      // find starting points
      var startingPoints = getCenterAlignedStartPointsForObjectRendering(ctx.canvas.width, [this.preTextImage.width, textWidth]);
      logDebug("Text width: " + startingPoints);
      // draw image
      ctx.drawImage(this.preTextImage, startingPoints[0], 1000 - this.preTextImage.height / 2, this.preTextImage.width, this.preTextImage.height);
      // draw text
      var storeTextAlign = ctx.textAlign;
      ctx.textAlign = "left";
      this.text.startingPoint.x = startingPoints[1];
      this.text.fillIntoCanvasCtx(ctx);
      ctx.textAlign = storeTextAlign;
    }
    else
    {
    	// MOVE TO CTOR!
      var storeTextAlign = ctx.textAlign;
      ctx.textAlign = "center";
      this.text.startingPoint.x = ctx.canvas.width / 2;
      this.text.fillIntoCanvasCtx(ctx);
      ctx.textAlign = storeTextAlign;
    }
  }
}

function main()
{
  var image = new Image();
  image.setAttribute('crossorigin', 'anonymous'); 
  image.src = InputGetter.getBackgroundImageSrc();
  var canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;
  var ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0);

  var canvasTitle = new CanvasTitle(InputGetter.getTitle(), ctx);
  var canvasBody = new CanvasBody(InputGetter.getShuffledNameValueStringArray(), ctx);
  var canvasFooter = new CanvasFooter(InputGetter.getFooter(), ctx, InputGetter.getFooterImageSrc());
  canvasTitle.renderToCanvasCtx(ctx);
  canvasFooter.renderToCanvasCtx(ctx);
  canvasBody.renderToCanvasCtx(ctx);

  var img = document.getElementById(generatedImageElementId);
  if (img == null)
  {
    img = document.createElement("img");
    img.id = "generatedImage";
  }
  img.src = canvas.toDataURL("image/png");
  img.style = "min-width: 330px;" + ((0.8 * document.documentElement.clientWidth < img.width) ? " width: 80vw;" : "");
  document.body.appendChild(img);
}
