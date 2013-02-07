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
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  AmoebaSB.NavigationControls = (function() {

    function NavigationControls(inNumSteps) {
      this._setupNextPrevButtons = __bind(this._setupNextPrevButtons, this);

      this._setupRadioButtons = __bind(this._setupRadioButtons, this);

      var _this = this;
      this.cssID = "navigationControls";
      this.el = $("#" + this.cssID);
      this._setupRadioButtons(inNumSteps);
      this._setupNextPrevButtons();
      document.addEventListener("slideTransitions:in", function(event) {
        var theIndex;
        theIndex = Number(event.detail);
        return $("input:radio[name=presentationRadioGroup]:nth(" + theIndex + ")").attr('checked', true);
      });
    }

    NavigationControls.prototype._setupRadioButtons = function(inNumSteps) {
      var theContainer, _i, _results,
        _this = this;
      theContainer = $('<div/>').css({
        position: "absolute",
        width: "100%",
        bottom: "0px",
        left: "50%"
      }).appendTo(this.el);
      _.each((function() {
        _results = [];
        for (var _i = 0; 0 <= inNumSteps ? _i < inNumSteps : _i > inNumSteps; 0 <= inNumSteps ? _i++ : _i--){ _results.push(_i); }
        return _results;
      }).apply(this), function(theStep, index) {
        var theRadio;
        theRadio = $('<input/>').attr({
          type: "radio",
          name: "presentationRadioGroup",
          value: theStep
        }).appendTo(theContainer);
        if (theStep === 0) {
          return theRadio.attr({
            checked: ""
          });
        }
      });
      return $("input[name=presentationRadioGroup]:radio").change(function() {
        var theValue;
        theValue = $(this).val();
        return AmoebaSB.eventHelper.triggerEvent(document, "navigateToIndexEventName", theValue);
      });
    };

    NavigationControls.prototype._setupNextPrevButtons = function(inNumSteps) {
      var theButton,
        _this = this;
      theButton = $('<a/>').attr({
        id: "nextButton"
      }).appendTo(this.el);
      theButton.click(function(event) {
        return AmoebaSB.eventHelper.triggerEvent(document, AmoebaSB.eventHelper.nextKeyEventName);
      });
      theButton = $('<a/>').attr({
        id: "prevButton"
      }).appendTo(this.el);
      return theButton.click(function(event) {
        return AmoebaSB.eventHelper.triggerEvent(document, AmoebaSB.eventHelper.prevKeyEventName);
      });
    };

    return NavigationControls;

  })();

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  AmoebaSB.SlideLayout = (function() {

    function SlideLayout($stage) {
      this._adjustStage = __bind(this._adjustStage, this);

      this._setupStage = __bind(this._setupStage, this);

      this._computeWindowScale = __bind(this._computeWindowScale, this);

      this.setupSlide = __bind(this.setupSlide, this);

      this.normal = __bind(this.normal, this);

      this.horizOffscreen = __bind(this.horizOffscreen, this);

      this.vertOffscreen = __bind(this.vertOffscreen, this);

      this.center = __bind(this.center, this);

      var _this = this;
      this.$stageHolder = $('#stageHolder');
      this.slideInset = 20;
      this.stageWidth = 960;
      this.stageHeight = 720;
      this.slideWidth = this.stageWidth - this.slideInset;
      this.slideHeight = this.stageHeight - this.slideInset;
      document.addEventListener(AmoebaSB.eventHelper.resizeEventName, function(event) {
        return _this._adjustStage();
      });
      this._setupStage($stage);
      this._adjustStage();
    }

    SlideLayout.prototype.center = function(eWidth, eHeight, more) {
      var result;
      result = {
        left: (this.slideWidth - eWidth) / 2,
        top: (this.slideHeight - eHeight) / 2,
        x: 0,
        y: 0
      };
      if (more != null) {
        result = _.extend(result, more);
      }
      return result;
    };

    SlideLayout.prototype.vertOffscreen = function(up, more) {
      var result;
      if (up == null) {
        up = true;
      }
      result = {
        y: up ? -window.innerHeight : window.innerHeight
      };
      if (more != null) {
        result = _.extend(result, more);
      }
      return result;
    };

    SlideLayout.prototype.horizOffscreen = function(left, more) {
      var result;
      if (left == null) {
        left = true;
      }
      if (more == null) {
        more = void 0;
      }
      result = {
        x: left ? -window.innerWidth : window.innerWidth
      };
      if (more != null) {
        result = _.extend(result, more);
      }
      return result;
    };

    SlideLayout.prototype.normal = function(opacity) {
      var result;
      if (opacity == null) {
        opacity = 1;
      }
      result = {
        y: 0,
        x: 0,
        rotate: 0,
        rotateY: 0,
        skewX: 0,
        skewY: 0,
        rotateX: 0,
        scale: 1,
        opacity: opacity,
        transformOrigin: '50% 50%'
      };
      return result;
    };

    SlideLayout.prototype.setupSlide = function($el) {
      return $el.css({
        position: "absolute",
        opacity: 0,
        width: this.slideWidth,
        height: this.slideHeight
      });
    };

    SlideLayout.prototype._computeWindowScale = function() {
      var hScale, scale, wScale;
      hScale = window.innerHeight / this.stageHeight;
      wScale = window.innerWidth / this.stageWidth;
      if (hScale > wScale) {
        scale = wScale;
      } else {
        scale = hScale;
      }
      if (scale > 1) {
        scale = 1;
      }
      if (scale < 0) {
        scale = 0;
      }
      return scale;
    };

    SlideLayout.prototype._setupStage = function($el) {
      return $el.css({
        top: 0,
        left: 0,
        position: "absolute",
        height: this.slideHeight,
        width: this.slideWidth,
        x: "-50%",
        y: "-50%",
        opacity: 1,
        transformOrigin: "50% 50%"
      });
    };

    SlideLayout.prototype._adjustStage = function() {
      var _this = this;
      if (!(this.internalScaleMethod != null)) {
        this.$stageHolder.css({
          position: "absolute",
          top: "50%",
          left: "50%",
          transformOrigin: "top left",
          height: "100%",
          width: "100%"
        });
        this.internalScaleMethod = _.throttle(function() {
          var windowScale;
          windowScale = _this._computeWindowScale();
          return _this.$stageHolder.transition({
            scale: windowScale
          }, 100);
        }, 500);
      }
      return this.internalScaleMethod();
    };

    return SlideLayout;

  })();

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  AmoebaSB.SlideTransitions = (function() {
    var SlideTransition;

    function SlideTransitions(slides) {
      this.slides = slides;
      this._rotateTransitionSpec = __bind(this._rotateTransitionSpec, this);

      this._zoomTransitionSpec = __bind(this._zoomTransitionSpec, this);

      this._warpTransitionSpec = __bind(this._warpTransitionSpec, this);

      this._fadeTransitionSpec = __bind(this._fadeTransitionSpec, this);

      this._dropTransitionSpec = __bind(this._dropTransitionSpec, this);

      this._slideTransitionSpec = __bind(this._slideTransitionSpec, this);

      this._transitionSpec = __bind(this._transitionSpec, this);

      this._sendEvents = __bind(this._sendEvents, this);

      this._slideAtIndex = __bind(this._slideAtIndex, this);

      this._nextStepIndex = __bind(this._nextStepIndex, this);

      this._validStepIndex = __bind(this._validStepIndex, this);

      this.goto = __bind(this.goto, this);

      this.prevIndex = __bind(this.prevIndex, this);

      this.nextIndex = __bind(this.nextIndex, this);

      this.duration = 1000;
    }

    SlideTransitions.prototype.nextIndex = function() {
      return this._nextStepIndex(true);
    };

    SlideTransitions.prototype.prevIndex = function() {
      return this._nextStepIndex(false);
    };

    SlideTransitions.prototype.goto = function(theIndex) {
      var active, goingBack, next;
      theIndex = this._validStepIndex(theIndex);
      if (this.activeStepIndex != null) {
        goingBack = theIndex < this.activeStepIndex;
      }
      if (theIndex !== this.activeStepIndex) {
        if (this.activeStepIndex != null) {
          active = this._slideAtIndex(this.activeStepIndex);
        }
        this.activeStepIndex = theIndex;
        next = this._slideAtIndex(this.activeStepIndex);
        if ((next != null) && (active != null)) {
          if (goingBack) {
            this._transitionSpec('previous').run(active, next, true);
          } else {
            this._transitionSpec(next.transition).run(active, next, true);
          }
        } else {
          next.el.css(AmoebaSB.layout.normal());
        }
        this._sendEvents(active, next);
        if ((theIndex % 2) === 0) {
          return $("#presentationBackColor").transition({
            backgroundColor: "rgba(255,2,2,0.4)"
          });
        } else {
          return $("#presentationBackColor").transition({
            backgroundColor: "rgba(0,0,0,0)"
          });
        }
      }
    };

    SlideTransitions.prototype._validStepIndex = function(theIndex) {
      if (theIndex < 0) {
        theIndex = 0;
      } else if (theIndex >= this.slides.length) {
        theIndex = this.slides.length - 1;
      }
      return theIndex;
    };

    SlideTransitions.prototype._nextStepIndex = function(nextFlag) {
      var theIndex;
      theIndex = this.activeStepIndex;
      if (theIndex !== -1) {
        if (nextFlag) {
          theIndex += 1;
        } else {
          theIndex -= 1;
        }
      }
      return this._validStepIndex(theIndex);
    };

    SlideTransitions.prototype._slideAtIndex = function(theIndex) {
      theIndex = this._validStepIndex(theIndex);
      return this.slides[theIndex];
    };

    SlideTransitions.prototype._sendEvents = function(active, next) {
      if (active != null) {
        active.slideOut();
        AmoebaSB.eventHelper.triggerEvent(active.el.get(0), "slideTransitions:out", this.slides.indexOf(active));
      }
      if (next != null) {
        next.slideIn();
        return AmoebaSB.eventHelper.triggerEvent(next.el.get(0), "slideTransitions:in", this.slides.indexOf(next));
      }
    };

    SlideTransitions.prototype._transitionSpec = function(theID) {
      var spec;
      switch (theID) {
        case 'zoom':
          spec = this._zoomTransitionSpec();
          break;
        case 'next':
          spec = this._slideTransitionSpec(false);
          break;
        case 'previous':
          spec = this._slideTransitionSpec(true);
          break;
        case 'down':
          spec = this._dropTransitionSpec(false);
          break;
        case 'up':
          spec = this._dropTransitionSpec(true);
          break;
        case 'fade':
          spec = this._fadeTransitionSpec();
          break;
        case 'warp':
          spec = this._warpTransitionSpec();
          break;
        case 'rotate':
          spec = this._rotateTransitionSpec();
          break;
        default:
          console.log("not found: " + theID);
      }
      return spec;
    };

    SlideTransitions.prototype._slideTransitionSpec = function(left) {
      var result;
      if (left == null) {
        left = false;
      }
      result = new SlideTransition(AmoebaSB.layout.horizOffscreen(left));
      result.addActive(AmoebaSB.layout.horizOffscreen(!left, {
        opacity: 0
      }));
      result.finalize({
        duration: this.duration
      });
      return result;
    };

    SlideTransitions.prototype._dropTransitionSpec = function(up) {
      var result;
      if (up == null) {
        up = true;
      }
      result = new SlideTransition(AmoebaSB.layout.vertOffscreen(up));
      result.addActive(AmoebaSB.layout.vertOffscreen(!up, {
        opacity: 0
      }));
      result.finalize({
        duration: this.duration
      });
      return result;
    };

    SlideTransitions.prototype._fadeTransitionSpec = function() {
      var result;
      result = new SlideTransition({
        opacity: 0
      });
      result.addActive({
        opacity: 0
      });
      result.finalize({
        duration: this.duration
      });
      return result;
    };

    SlideTransitions.prototype._warpTransitionSpec = function() {
      var result, winWidth;
      winWidth = window.innerWidth;
      result = new SlideTransition({
        scale: 0.4,
        x: -winWidth
      });
      result.addActive({
        opacity: 0.8,
        scale: 0.4
      });
      result.addActive({
        opacity: 0,
        skewX: 80,
        x: winWidth
      });
      result.addNext({
        opacity: 1,
        x: 0,
        delay: this.duration / 2
      });
      result.finalize({
        duration: this.duration
      });
      return result;
    };

    SlideTransitions.prototype._zoomTransitionSpec = function() {
      var result;
      result = new SlideTransition({
        opacity: 0,
        scale: 0,
        rotate: 60
      });
      result.addActive({
        opacity: 0.5,
        scale: 1.5,
        easing: 'out',
        duration: this.duration * .2
      });
      result.addActive({
        opacity: 0,
        scale: 0,
        easing: 'ease',
        duration: this.duration * .8
      });
      result.finalize({
        delay: 300,
        duration: this.duration
      });
      return result;
    };

    SlideTransitions.prototype._rotateTransitionSpec = function() {
      var result;
      result = new SlideTransition({
        opacity: 0,
        rotate: -180
      });
      result.addActive({
        opacity: 0,
        rotate: 180
      });
      result.setTransformOrigin('50% 100%');
      result.finalize({
        duration: this.duration
      });
      return result;
    };

    SlideTransition = (function() {

      function SlideTransition(nextSlideState) {
        this.nextSlideState = nextSlideState;
        this.finalize = __bind(this.finalize, this);

        this.setTransformOrigin = __bind(this.setTransformOrigin, this);

        this.run = __bind(this.run, this);

        this._nextArray = [];
        this._activeArray = [];
      }

      SlideTransition.prototype.run = function(active, next, animate) {
        var _this = this;
        if ((active != null) && (next != null)) {
          next.el.css($.extend(AmoebaSB.layout.normal(0), this.nextSlideState));
          if (this.transformOrigin != null) {
            active.el.css({
              transformOrigin: this.transformOrigin
            });
            next.el.css({
              transformOrigin: this.transformOrigin
            });
          }
          _.each(this._activeArray, function(trans, index) {
            if (animate) {
              return active.el.transition(trans);
            } else {
              return active.el.css(trans);
            }
          });
          return _.each(this._nextArray, function(trans, index) {
            if (animate) {
              return next.el.transition(trans);
            } else {
              return next.el.css(trans);
            }
          });
        } else {
          return console.log("SlideTransition run: bad parameter");
        }
      };

      SlideTransition.prototype.addNext = function(obj) {
        return this._nextArray.push(obj);
      };

      SlideTransition.prototype.addActive = function(obj) {
        return this._activeArray.push(obj);
      };

      SlideTransition.prototype.setTransformOrigin = function(origin) {
        return this.transformOrigin = origin;
      };

      SlideTransition.prototype.finalize = function(finalParams) {
        var finalPosition;
        finalPosition = AmoebaSB.layout.normal();
        if (finalParams != null) {
          finalPosition = $.extend(finalPosition, finalParams);
        }
        return this._nextArray.push(finalPosition);
      };

      return SlideTransition;

    })();

    return SlideTransitions;

  }).call(this);

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
