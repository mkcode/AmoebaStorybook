(function() {
  var num, test,
    _this = this;

  num = 0;

  test = function() {
    return "hello world " + (num++);
  };

  if (typeof exports === "object" && exports) {
    exports.hello = test;
  }

  console.log("asshat");

  window.testt = test;

}).call(this);

(function() {



}).call(this);
