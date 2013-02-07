num = 0
test = =>
  return "hello world #{num++}"

# interface for nodejs return object
if typeof exports == "object" && exports
	exports.hello = test

console.log("asshat")

window.testt = test;

