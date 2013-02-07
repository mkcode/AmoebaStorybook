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



}).call(this);
