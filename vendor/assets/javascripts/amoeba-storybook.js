(function() {
  var _ref;

  if ((_ref = window.AmoebaSB) == null) {
    window.AmoebaSB = {};
  }

  jQuery(function($) {
    return AmoebaSB.eventHelper = new AmoebaSB.EventHelper;
  });

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  AmoebaSB.EventHelper = (function() {

    function EventHelper() {
      this._handleKeyEvent = __bind(this._handleKeyEvent, this);

      this._setupKeyHandler = __bind(this._setupKeyHandler, this);

      this.triggerEvent = __bind(this.triggerEvent, this);
      this._setupKeyHandler();
      this.nextKeyEventName = "next:keyEvent";
      this.prevKeyEventName = "prev:keyEvent";
      this.resizeEventName = "resize:windowEvent";
    }

    EventHelper.prototype.triggerEvent = function(el, eventName, detail) {
      var event;
      event = document.createEvent("CustomEvent");
      event.initCustomEvent(eventName, true, true, detail);
      return el.dispatchEvent(event);
    };

    EventHelper.prototype._setupKeyHandler = function() {
      var _this = this;
      document.addEventListener("keydown", function(event) {
        return _this._handleKeyEvent(event);
      });
      document.addEventListener("keyup", function(event) {
        return _this._handleKeyEvent(event);
      });
      document.addEventListener("touchstart", function(event) {
        var width, x;
        if (event.touches.length === 1) {
          x = event.touches[0].clientX;
          width = window.innerWidth * 0.3;
          if (x < width) {
            _this.triggerEvent(document, _this.prevKeyEventName);
            return event.preventDefault();
          } else if (x > window.innerWidth - width) {
            _this.triggerEvent(document, _this.nextKeyEventName);
            return event.preventDefault();
          }
        }
      });
      return window.addEventListener("resize", function(event) {
        if (!_this.sentReizeEvent) {
          _this.sentResizeEvent = true;
          return setTimeout(function() {
            _this.triggerEvent(document, _this.resizeEventName);
            return _this.sentResizeEvent = false;
          }, 250);
        }
      });
    };

    EventHelper.prototype._handleKeyEvent = function(event) {
      var downArrow, leftArrow, rightArrow, sendEvent, spaceBar, tabKey, upArrow;
      tabKey = 9;
      spaceBar = 32;
      leftArrow = 37;
      upArrow = 38;
      rightArrow = 39;
      downArrow = 40;
      sendEvent = false;
      if (event.type === 'keyup') {
        sendEvent = true;
      }
      switch (event.keyCode) {
        case tabKey:
        case downArrow:
        case rightArrow:
        case spaceBar:
          event.preventDefault();
          if (sendEvent) {
            return this.triggerEvent(document, this.nextKeyEventName);
          }
          break;
        case leftArrow:
        case upArrow:
          event.preventDefault();
          if (sendEvent) {
            return this.triggerEvent(document, this.prevKeyEventName);
          }
      }
    };

    return EventHelper;

  })();

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  AmoebaSB.GraphicsPaper = (function() {

    function GraphicsPaper(divHolder, attr) {
      this.divHolder = divHolder;
      this._fadePoint = __bind(this._fadePoint, this);

      this.clearPoints = __bind(this.clearPoints, this);

      this.clearAll = __bind(this.clearAll, this);

      this.pulsatePoints = __bind(this.pulsatePoints, this);

      if (attr == null) {
        attr = {
          fill: "90-#aaf-#004",
          stroke: "#f99"
        };
      }
      this.paper = Raphael(this.divHolder);
      this.paper.rect(0, 0, this.width(), this.height()).attr(attr);
      this.points = [];
    }

    GraphicsPaper.prototype.width = function() {
      if (this.paper.canvas.clientWidth) {
        return this.paper.canvas.clientWidth;
      } else {
        return this.paper.width;
      }
    };

    GraphicsPaper.prototype.height = function() {
      if (this.paper.canvas.clientHeight) {
        return this.paper.canvas.clientHeight;
      } else {
        return this.paper.height;
      }
    };

    GraphicsPaper.prototype.addPoints = function(points, radius, color) {
      var _this = this;
      if (color == null) {
        color = "#f00";
      }
      return _.each(points, function(point) {
        var circle;
        circle = _this.paper.circle(point.x, point.y, radius);
        circle.attr({
          fill: color,
          stroke: "none"
        });
        return _this.points.push(circle);
      });
    };

    GraphicsPaper.prototype.pulsatePoints = function() {
      var _this = this;
      return _.each(this.points, function(point) {
        return _this._fadePoint(true, point);
      });
    };

    GraphicsPaper.prototype.clearAll = function() {
      return this.paper.clear();
    };

    GraphicsPaper.prototype.clearPoints = function() {
      var _this = this;
      return _.each(this.points, function(point) {
        return point.remove();
      });
    };

    GraphicsPaper.prototype._fadePoint = function(out, point) {
      var fadeIn, fadeOut,
        _this = this;
      fadeOut = Raphael.animation({
        transform: "s2",
        opacity: 1
      }, 600, "<", function() {
        return _this._fadePoint(!out, point);
      });
      fadeIn = Raphael.animation({
        transform: "s1",
        opacity: 0.1
      }, 600, ">", function() {
        return _this._fadePoint(!out, point);
      });
      point.stop();
      if (out) {
        return point.animate(fadeOut);
      } else {
        return point.animate(fadeIn);
      }
    };

    return GraphicsPaper;

  })();

  AmoebaSB.Point = (function() {

    function Point(x, y) {
      this.x = x;
      this.y = y;
    }

    Point.prototype.toString = function() {
      return "(" + this.x + ", " + this.y + ")";
    };

    Point.prototype.distance = function(point2) {
      var xs, ys;
      xs = point2.x - this.x;
      xs = xs * xs;
      ys = point2.y - this.y;
      ys = ys * ys;
      return Math.sqrt(xs + ys);
    };

    return Point;

  })();

  AmoebaSB.Pair = (function() {

    function Pair(left, right) {
      this.left = left;
      this.right = right;
    }

    Pair.prototype.toString = function() {
      return "(" + this.left + ", " + this.right + ")";
    };

    return Pair;

  })();

  AmoebaSB.Rect = (function() {

    function Rect(x, y, w, h) {
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
    }

    Rect.prototype.toString = function() {
      return "(x:" + this.x + ", y:" + this.y + ", w:" + this.w + ", h:" + this.h + ")";
    };

    return Rect;

  })();

  AmoebaSB.Graphics = (function() {

    function Graphics() {}

    Graphics.toDegrees = function(angle) {
      return angle * (180 / Math.PI);
    };

    Graphics.toRadians = function(angle) {
      return angle * (Math.PI / 180);
    };

    Graphics.pointForAngle = function(degrees, radius, centerPoint) {
      var cosValue, sinValue;
      cosValue = Math.cos(AmoebaSB.Graphics.toRadians(degrees));
      sinValue = Math.sin(AmoebaSB.Graphics.toRadians(degrees));
      return new AmoebaSB.Point(centerPoint.x + (cosValue * radius), centerPoint.y + (sinValue * radius));
    };

    Graphics.normalizePath = function(path) {
      var bBox, theMatrix, transformString;
      bBox = Raphael.pathBBox(path);
      theMatrix = new Raphael.matrix();
      theMatrix.translate(-bBox.x, -bBox.y);
      transformString = theMatrix.toTransformString();
      path = Raphael.transformPath(path, transformString);
      return path;
    };

    Graphics.scalePath = function(path, amountX, amountY) {
      var theMatrix, transformString;
      theMatrix = new Raphael.matrix();
      theMatrix.scale(amountX, amountY);
      transformString = theMatrix.toTransformString();
      path = Raphael.transformPath(path, transformString);
      return path;
    };

    Graphics.translatePath = function(path, amountX, amountY) {
      var theMatrix, transformString;
      theMatrix = new Raphael.matrix();
      theMatrix.translate(amountX, amountY);
      transformString = theMatrix.toTransformString();
      path = Raphael.transformPath(path, transformString);
      return path;
    };

    Graphics.rotatePath = function(path, degrees) {
      var bBox, theMatrix, transformString;
      bBox = Raphael.pathBBox(path);
      theMatrix = new Raphael.matrix();
      theMatrix.rotate(degrees, bBox.x + (bBox.width / 2), bBox.y + (bBox.height / 2));
      transformString = theMatrix.toTransformString();
      path = Raphael.transformPath(path, transformString);
      return path;
    };

    Graphics.circleWithFourPoints = function(x, y, r) {
      var centerPoint, result,
        _this = this;
      centerPoint = new AmoebaSB.Point(x, y);
      result = void 0;
      _.each([0, 90, 180, 270, 360], function(degrees) {
        var point;
        point = _this.pointForAngle(degrees, r, centerPoint);
        if ((result != null)) {
          return result += "A" + r + "," + r + ",0,0,1," + point.x + "," + point.y;
        } else {
          return result = "M" + (x + r) + ", " + y;
        }
      });
      if (result != null) {
        result += "z";
        result = this.rotatePath(result, -135);
      }
      return result;
    };

    Graphics.rectWithFourPoints = function(x, y, w, h) {
      var result;
      result = "M" + x + ", " + y;
      result += "l" + w + ", 0";
      result += "l0, " + h;
      result += "l" + (-w) + ", 0";
      result += "l0, " + (-h);
      return result;
    };

    Graphics.trianglePath = function(x, y, x1, y1, x2, y2) {
      var result;
      result = "M" + x + "," + y;
      result += "L" + x1 + "," + y1;
      result += "L" + x2 + "," + y2;
      return result;
    };

    return Graphics;

  })();

}).call(this);

(function() {



}).call(this);
