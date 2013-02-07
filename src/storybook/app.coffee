num = 0
test = =>
  return "hello world #{num++}"

window.testt = test;

# interface for nodejs return object
if typeof exports == "object" && exports
	exports.hello = test

