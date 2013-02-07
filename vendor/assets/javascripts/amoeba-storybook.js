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
  var CogAnimation,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  AmoebaSB.CogDemo = (function() {

    function CogDemo(divHolder, size, numSegments) {
      var cog;
      this.size = size;
      this.numSegments = numSegments;
      this.stop = __bind(this.stop, this);

      this.start = __bind(this.start, this);

      this.graphicsPaper = new AmoebaSB.GraphicsPaper(divHolder, {
        fill: "transparent",
        stroke: "transparent"
      });
      this.animations = [];
      cog = new AmoebaSB.Cog(this.size, this.numSegments, this.graphicsPaper);
      this.pathMap = {
        "cog": cog.path(true),
        "circleCog": cog.path(false),
        "circle4Points": AmoebaSB.Graphics.circleWithFourPoints(0, 0, this.size / 2),
        "rect4Points": AmoebaSB.Graphics.rectWithFourPoints(0, 0, 200, 300)
      };
    }

    CogDemo.prototype.start = function() {
      var amoebaColors, one, _i, _len, _ref, _results,
        _this = this;
      this.stop();
      amoebaColors = ["#384F0E", "#8BA400", "#A6CC2F"];
      _.each([0, 1, 2], function(i) {
        return _this.animations.push(new CogAnimation(amoebaColors[i], i, _this.size, _this.graphicsPaper, _this.pathMap));
      });
      _ref = this.animations;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        one = _ref[_i];
        _results.push(one.animate());
      }
      return _results;
    };

    CogDemo.prototype.stop = function() {
      var one, _i, _len, _ref;
      if (this.animations != null) {
        _ref = this.animations;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          one = _ref[_i];
          one.remove();
        }
      }
      return this.animations.length = 0;
    };

    return CogDemo;

  })();

  CogAnimation = (function() {

    function CogAnimation(fillColor, index, cogSize, graphicsPaper, pathMap) {
      this.fillColor = fillColor;
      this.index = index;
      this.cogSize = cogSize;
      this.pathMap = pathMap;
      this.changeToPathFive = __bind(this.changeToPathFive, this);

      this.changeToPathFour = __bind(this.changeToPathFour, this);

      this.changeToPathThree = __bind(this.changeToPathThree, this);

      this.changeToPathTwo = __bind(this.changeToPathTwo, this);

      this.rotate = __bind(this.rotate, this);

      this.pathSwitch = true;
      this.removed = false;
      this.mainPath = graphicsPaper.paper.path(this.pathOne()).attr({
        fill: this.fillColor,
        opacity: 0,
        transform: "t" + (graphicsPaper.width()) + ",0"
      });
    }

    CogAnimation.prototype.remove = function() {
      var _this = this;
      this.removed = true;
      return this.mainPath.animate({
        opacity: 0
      }, 400, "<>", function() {
        return _this.mainPath.remove();
      });
    };

    CogAnimation.prototype.animate = function() {
      var _this = this;
      return setTimeout(function() {
        return _this._animate();
      }, 100 * this.index);
    };

    CogAnimation.prototype._animate = function() {
      var _this = this;
      this._stop();
      return this.mainPath.animate({
        opacity: 1,
        transform: "t0,0"
      }, 600, "<>", function() {
        return _this.rotate();
      });
    };

    CogAnimation.prototype._stop = function() {
      if (!this.removed) {
        return this.mainPath.stop();
      }
    };

    CogAnimation.prototype.rotate = function() {
      var end, start,
        _this = this;
      start = "r0";
      end = "r360";
      if ((this.index % 2) === 0) {
        start = "r360";
        end = "r0";
      }
      return this.mainPath.animate({
        transform: start
      }, 0, "", function() {
        return _this.mainPath.animate({
          transform: end
        }, 6000, "<>", function() {
          return _this.changeToPathTwo();
        });
      });
    };

    CogAnimation.prototype.changeToPathTwo = function() {
      var _this = this;
      return this.mainPath.animate({
        path: this.pathTwo()
      }, 800, "<>", function() {
        return _this.changeToPathThree();
      });
    };

    CogAnimation.prototype.changeToPathThree = function() {
      var _this = this;
      return this.mainPath.animate({
        path: this.pathThree()
      }, 0, "", function() {
        return _this.changeToPathFour();
      });
    };

    CogAnimation.prototype.changeToPathFour = function() {
      var _this = this;
      return this.mainPath.animate({
        path: this.pathFour()
      }, 800, "<>", function() {
        return _this.changeToPathFive();
      });
    };

    CogAnimation.prototype.changeToPathFive = function() {
      var _this = this;
      return setTimeout(function() {
        var bBox, diff;
        bBox = _this.mainPath.getBBox();
        if ((bBox != null)) {
          diff = 700 - bBox.y2;
          return _this.mainPath.animate({
            transform: "t0," + diff
          }, 800, "bounce", function() {
            return console.log("done");
          });
        }
      }, 500);
    };

    CogAnimation.prototype.pathOne = function() {
      var result, y;
      result = this.pathMap["cog"];
      result = AmoebaSB.Graphics.normalizePath(result);
      y = 0;
      if ((this.index % 2) !== 0) {
        y = 200;
      }
      result = AmoebaSB.Graphics.translatePath(result, this.index * (this.cogSize - 80), y);
      return result;
    };

    CogAnimation.prototype.pathTwo = function() {
      var result;
      result = this.pathMap["circleCog"];
      result = AmoebaSB.Graphics.normalizePath(result);
      result = AmoebaSB.Graphics.scalePath(result, .5, .5);
      result = AmoebaSB.Graphics.translatePath(result, 100 + this.index * 220, 120);
      return result;
    };

    CogAnimation.prototype.pathThree = function() {
      var result;
      result = this.pathMap["circle4Points"];
      result = AmoebaSB.Graphics.normalizePath(result);
      result = AmoebaSB.Graphics.scalePath(result, .5, .5);
      result = AmoebaSB.Graphics.translatePath(result, 100 + this.index * 220, 120);
      return result;
    };

    CogAnimation.prototype.pathFour = function() {
      var result;
      result = this.pathMap["rect4Points"];
      result = AmoebaSB.Graphics.normalizePath(result);
      result = AmoebaSB.Graphics.scalePath(result, .5, .5 + .3 * (3 - this.index));
      result = AmoebaSB.Graphics.translatePath(result, 500 + (this.index * 120), 220);
      return result;
    };

    return CogAnimation;

  })();

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
  var CogSegment,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  AmoebaSB.Cog = (function() {

    function Cog(size, numSegments, graphicsPaper) {
      this.size = size;
      this.numSegments = numSegments;
      this.graphicsPaper = graphicsPaper;
      this._createCogSegments = __bind(this._createCogSegments, this);

      this._pairsAroundCircle = __bind(this._pairsAroundCircle, this);

      this._pointsAroundCircle = __bind(this._pointsAroundCircle, this);

      this.showPoints = __bind(this.showPoints, this);

    }

    Cog.prototype.path = function(showTeeth) {
      var result, segments,
        _this = this;
      segments = this._createCogSegments(this.size, showTeeth, this.numSegments);
      result = void 0;
      _.each(segments, function(segment) {
        if (!(result != null)) {
          result = "M" + segment.bottomLeft.x + "," + segment.bottomLeft.y;
        }
        return result += segment.path();
      });
      result += "z";
      return result;
    };

    Cog.prototype.showPoints = function() {
      var segments,
        _this = this;
      segments = this._createCogSegments(this.size, true, this.numSegments);
      return _.each(segments, function(segment) {
        return segment.debugPoints(_this.graphicsPaper);
      });
    };

    Cog.prototype._pointsAroundCircle = function(size, inset, numSegments, shift) {
      var centerPoint, degrees, radius, result, _i, _results,
        _this = this;
      if (shift == null) {
        shift = 0;
      }
      centerPoint = new AmoebaSB.Point(size / 2, size / 2);
      radius = (size - (inset * 2)) / 2;
      degrees = 360 / numSegments;
      result = [];
      _.each((function() {
        _results = [];
        for (var _i = 0; 0 <= numSegments ? _i <= numSegments : _i >= numSegments; 0 <= numSegments ? _i++ : _i--){ _results.push(_i); }
        return _results;
      }).apply(this), function(i) {
        var angle, degreesShift;
        angle = i * degrees;
        degreesShift = degrees * 0.15;
        if (shift === -1) {
          angle -= degreesShift;
        } else if (shift === 1) {
          angle += degreesShift;
        }
        if (angle >= 360) {
          angle = angle - 360;
        } else if (angle < 0) {
          angle = 360 + angle;
        }
        return result.push(AmoebaSB.Graphics.pointForAngle(angle, radius, centerPoint));
      });
      return result;
    };

    Cog.prototype._pairsAroundCircle = function(size, inset, numSegments, shifted) {
      var leftPoints, points, prevPoint, result, rightPoints, _i, _ref, _results,
        _this = this;
      if (shifted == null) {
        shifted = false;
      }
      result = [];
      if (!shifted) {
        points = this._pointsAroundCircle(size, inset, numSegments);
        prevPoint = void 0;
        _.each(points, function(nextPoint) {
          if ((prevPoint != null)) {
            result.push(new AmoebaSB.Pair(prevPoint, nextPoint));
          }
          return prevPoint = nextPoint;
        });
      } else {
        leftPoints = this._pointsAroundCircle(size, inset, numSegments, -1);
        rightPoints = this._pointsAroundCircle(size, inset, numSegments, -1);
        _.each((function() {
          _results = [];
          for (var _i = 0, _ref = leftPoints.length - 1; 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--){ _results.push(_i); }
          return _results;
        }).apply(this), function(i) {
          return result.push(new AmoebaSB.Pair(leftPoints[i], rightPoints[i + 1]));
        });
      }
      return result;
    };

    Cog.prototype._createCogSegments = function(size, showTeeth, numSegments) {
      var innerPoints, isTooth, outerPoints, result, toothHeight, _i, _results,
        _this = this;
      result = [];
      toothHeight = 0;
      outerPoints = this._pairsAroundCircle(size, 0, numSegments, false);
      if (showTeeth) {
        toothHeight = outerPoints[0].left.distance(outerPoints[0].right) * 0.55;
      }
      innerPoints = this._pairsAroundCircle(size, toothHeight, numSegments, false);
      if ((outerPoints.length !== innerPoints.length) || (outerPoints.length !== numSegments)) {
        console.log("inner and outer points not right?");
      } else {
        isTooth = false;
        _.each((function() {
          _results = [];
          for (var _i = 0; 0 <= numSegments ? _i < numSegments : _i > numSegments; 0 <= numSegments ? _i++ : _i--){ _results.push(_i); }
          return _results;
        }).apply(this), function(i) {
          var innerPoint, newSegment, outerPoint;
          outerPoint = outerPoints[i];
          innerPoint = innerPoints[i];
          newSegment = new CogSegment(isTooth, size, toothHeight, outerPoint.left, outerPoint.right, innerPoint.left, innerPoint.right);
          result.push(newSegment);
          return isTooth = !isTooth;
        });
      }
      return result;
    };

    return Cog;

  })();

  CogSegment = (function() {

    function CogSegment(isTooth, size, toothHeight, topLeft, topRight, bottomLeft, bottomRight) {
      this.isTooth = isTooth;
      this.size = size;
      this.toothHeight = toothHeight;
      this.topLeft = topLeft;
      this.topRight = topRight;
      this.bottomLeft = bottomLeft;
      this.bottomRight = bottomRight;
      this.outerRadius = this.size / 2;
      this.innerRadius = (this.size - (this.toothHeight * 2)) / 2;
    }

    CogSegment.prototype.toString = function() {
      return "(" + this.topLeft + ", " + this.topRight + ", " + this.bottomLeft + ", " + this.bottomRight + ")";
    };

    CogSegment.prototype.debugPoints = function(graphicsPaper) {
      if (this.isTooth) {
        graphicsPaper.addPoints([this.topLeft], 2, "black");
        graphicsPaper.addPoints([this.topRight], 2, "orange");
        graphicsPaper.addPoints([this.bottomLeft], 2, "black");
        return graphicsPaper.addPoints([this.bottomRight], 2, "orange");
      } else {
        graphicsPaper.addPoints([this.topLeft], 2, "red");
        graphicsPaper.addPoints([this.topRight], 2, "yellow");
        graphicsPaper.addPoints([this.bottomLeft], 2, "red");
        return graphicsPaper.addPoints([this.bottomRight], 2, "yellow");
      }
    };

    CogSegment.prototype.path = function() {
      var flag, result;
      result = "";
      if (this.isTooth) {
        result += "L" + this.topLeft.x + "," + this.topLeft.y;
        result += "A" + this.outerRadius + "," + this.outerRadius + ",0,0,1," + this.topRight.x + "," + this.topRight.y;
        result += "L" + this.bottomRight.x + "," + this.bottomRight.y;
      } else {
        flag = 1;
        if (this.toothHeight > 0) {
          flag = 0;
        }
        result += "A" + this.outerRadius + "," + this.outerRadius + ",0,0," + flag + "," + this.bottomRight.x + "," + this.bottomRight.y;
      }
      return result;
    };

    return CogSegment;

  })();

}).call(this);

(function() {



}).call(this);
