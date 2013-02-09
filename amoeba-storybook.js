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
  var _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  AmoebaSB.KeyframeAnimationPlugin = (function() {

    function KeyframeAnimationPlugin() {
      this.animationCallback = __bind(this.animationCallback, this);

      this._setupJQueryFunctions = __bind(this._setupJQueryFunctions, this);

      var key, opts, style, _props;
      if (AmoebaSB.keyframeAnimationPlugin != null) {
        console.log("AmoebaSB.keyframeAnimationPlugin created twice?");
      }
      _props = {
        animation: ['animation', 'animationend', 'keyframes'],
        webkitAnimation: ['-webkit-animation', 'webkitAnimationEnd', '-webkit-keyframes'],
        MozAnimation: ['-moz-animation', 'animationend', '-moz-keyframes'],
        OAnimation: ['-o-animation', 'oAnimationEnd', '-o-keyframes'],
        MSAnimation: ['-ms-animation', 'MSAnimationEnd', '-ms-keyframes']
      };
      style = document.createElement('div').style;
      for (key in _props) {
        if (style[key] !== void 0) {
          opts = _props[key];
          this.animationProperty = opts[0];
          this.endAnimation = opts[1];
          this.keyFramesProperty = opts[2];
          break;
        }
      }
      this._setupJQueryFunctions();
    }

    KeyframeAnimationPlugin.prototype._setupJQueryFunctions = function() {
      $.fn.keyframe = function(name, duration, easing, delay, iterations, direction, callback) {
        var params;
        if (typeof duration === 'object') {
          callback = duration.complete;
          direction = duration.direction;
          iterations = duration.iterations;
          delay = duration.delay;
          easing = duration.easing;
          duration = duration.duration;
        }
        direction = direction || 'normal';
        iterations = iterations || 1;
        delay = delay || 0;
        easing = easing || 'linear';
        duration = duration || 1;
        if (typeof duration === 'number') {
          duration += 'ms';
        }
        if (typeof delay === 'number') {
          delay += 'ms';
        }
        if (callback) {
          AmoebaSB.keyframeAnimationPlugin.animationCallback(this, callback);
        }
        params = [name, duration, easing, delay, iterations, direction].join(' ');
        return this.css(AmoebaSB.keyframeAnimationPlugin.animationProperty, params);
      };
      return this;
    };

    KeyframeAnimationPlugin.prototype.animationCallback = function(element, callback) {
      return element.one(this.endAnimation, element, callback);
    };

    return KeyframeAnimationPlugin;

  })();

  if ((_ref = AmoebaSB.keyframeAnimationPlugin) == null) {
    AmoebaSB.keyframeAnimationPlugin = new AmoebaSB.KeyframeAnimationPlugin();
  }

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

    function NavigationControls(numSteps) {
      var _this = this;
      this.numSteps = numSteps;
      this._setupNextPrevButtons = __bind(this._setupNextPrevButtons, this);

      this._setupRadioButtons = __bind(this._setupRadioButtons, this);

      this.cssID = "navigationControls";
      this.el = $("#" + this.cssID);
      this._setupRadioButtons();
      this._setupNextPrevButtons();
      document.addEventListener("slideTransitions:in", function(event) {
        var ratio, theIndex;
        theIndex = Number(event.detail);
        $("input:radio[name=presentationRadioGroup]:nth(" + theIndex + ")").attr('checked', true);
        ratio = theIndex / (_this.numSteps - 1);
        return $("#progressBar span").css({
          width: "" + (ratio * window.innerWidth) + "px"
        });
      });
      $('<div/>').appendTo(this.el).attr({
        id: "progressBar"
      }).html('<span></span>').click(function(event) {
        var slideIndex;
        slideIndex = Math.floor((event.clientX / _this.el.get(0).offsetWidth) * _this.numSteps);
        return AmoebaSB.eventHelper.triggerEvent(document, "navigateToIndexEventName", slideIndex);
      });
    }

    NavigationControls.prototype._setupRadioButtons = function() {
      var theContainer, _i, _ref, _results,
        _this = this;
      theContainer = $('<div/>').css({
        position: "absolute",
        width: "100%",
        bottom: "0px",
        left: "50%"
      }).appendTo(this.el);
      _.each((function() {
        _results = [];
        for (var _i = 0, _ref = this.numSteps; 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--){ _results.push(_i); }
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

    NavigationControls.prototype._setupNextPrevButtons = function() {
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

  AmoebaSB.Slide_Base = (function() {

    function Slide_Base() {
      this._setupElement = __bind(this._setupElement, this);

      this._update = __bind(this._update, this);

      this.slideIn = __bind(this.slideIn, this);

      this.slideOut = __bind(this.slideOut, this);

      this.previous = __bind(this.previous, this);

      this.next = __bind(this.next, this);
      this.stepIndex = 0;
      this.previousStepIndex = 0;
      this.numSteps = 0;
      this.cssID = "????";
      this.transition = 'fade';
      this.setup();
    }

    Slide_Base.prototype.setup = function() {
      return console.log("must subclass and implement setup");
    };

    Slide_Base.prototype.next = function() {
      if (this.stepIndex < (this.numSteps - 1)) {
        this.previousStepIndex = this.stepIndex;
        this.stepIndex++;
        this._update();
        return true;
      }
      return false;
    };

    Slide_Base.prototype.previous = function() {
      if (this.stepIndex > 0) {
        this.previousStepIndex = this.stepIndex;
        this.stepIndex--;
        this._update();
        return true;
      }
      return false;
    };

    Slide_Base.prototype.slideOut = function() {};

    Slide_Base.prototype.slideIn = function() {};

    Slide_Base.prototype._update = function() {
      return console.log("must subclass and implement _update");
    };

    Slide_Base.prototype._setupElement = function(theID) {
      this.cssID = theID;
      this.el = $("#" + this.cssID);
      return AmoebaSB.layout.setupSlide(this.el);
    };

    return Slide_Base;

  })();

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  AmoebaSB.SlideLayout = (function() {

    function SlideLayout($stage, $stageHolder) {
      var _this = this;
      this.$stage = $stage;
      this.$stageHolder = $stageHolder;
      this._adjustStage = __bind(this._adjustStage, this);

      this._setupStage = __bind(this._setupStage, this);

      this._computeWindowScale = __bind(this._computeWindowScale, this);

      this.setupSlide = __bind(this.setupSlide, this);

      this.normal = __bind(this.normal, this);

      this.horizOffscreen = __bind(this.horizOffscreen, this);

      this.vertOffscreen = __bind(this.vertOffscreen, this);

      this.center = __bind(this.center, this);

      this.slideInset = 20;
      this.stageWidth = 960;
      this.stageHeight = 720;
      this.slideWidth = this.stageWidth - this.slideInset;
      this.slideHeight = this.stageHeight - this.slideInset;
      document.addEventListener(AmoebaSB.eventHelper.resizeEventName, function(event) {
        return _this._adjustStage();
      });
      this._setupStage(this.$stage);
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



}).call(this);
