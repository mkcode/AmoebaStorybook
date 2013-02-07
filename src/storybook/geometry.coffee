
class AmoebaSB.GraphicsPaper
  constructor: (@divHolder, attr) ->

    attr ?= {fill: "90-#aaf-#004", stroke: "#f99"}

    @paper = Raphael(@divHolder)
    @paper.rect(0, 0, this.width(), this.height()).attr(attr)

    @points = []

  width: ->
    # not sure why there isn't a size method on paper, using this I found online
    return if @paper.canvas.clientWidth then @paper.canvas.clientWidth else @paper.width

  height: ->
    # not sure why there isn't a size method on paper, using this I found online
    return if @paper.canvas.clientHeight then @paper.canvas.clientHeight else @paper.height

  addPoints: (points, radius, color="#f00") ->
    _.each(points, (point) =>
      circle = @paper.circle(point.x, point.y, radius)
      circle.attr({fill: color, stroke: "none"})

      @points.push(circle)
    )

  pulsatePoints: =>
    _.each(@points, (point) =>
      this._fadePoint(true, point)
    )

  clearAll: =>
    @paper.clear()

  clearPoints: =>
    # clearAll removes every element, but we only want to remove stuff we know about
    _.each(@points, (point) =>
      point.remove()
    )

  _fadePoint: (out, point) =>
    fadeOut = Raphael.animation({transform: "s2", opacity: 1}, 600, "<", =>
      this._fadePoint(not out, point))

    fadeIn = Raphael.animation({transform: "s1", opacity: 0.1}, 600, ">", =>
      this._fadePoint(not out, point))

    point.stop() # stop if currently animating

    if out
      point.animate(fadeOut)
    else
      point.animate(fadeIn)

# ============
# AmoebaSB.Point
# ============

class AmoebaSB.Point
  constructor: (@x, @y) ->

  toString: ->
    return "(#{@x}, #{@y})"

  distance: (point2) ->
    xs = point2.x - this.x
    xs = xs * xs

    ys = point2.y - this.y
    ys = ys * ys

    return Math.sqrt( xs + ys )

# ============
# AmoebaSB.Pair
# ============

class AmoebaSB.Pair
  constructor: (@left, @right) ->

  toString: ->
    return "(#{@left}, #{@right})"

# ============
# AmoebaSB.Rect
# ============

class AmoebaSB.Rect
  constructor: (@x, @y, @w, @h) ->

  toString: ->
    return "(x:#{@x}, y:#{@y}, w:#{@w}, h:#{@h})"

# ============
# AmoebaSB.Graphics
# ============

class AmoebaSB.Graphics
  @toDegrees: (angle) ->
    return angle * (180 / Math.PI)

  @toRadians: (angle) ->
    return angle * (Math.PI / 180)

  @pointForAngle: (degrees, radius, centerPoint) ->
    cosValue = Math.cos(AmoebaSB.Graphics.toRadians(degrees))
    sinValue = Math.sin(AmoebaSB.Graphics.toRadians(degrees))

    return new AmoebaSB.Point(centerPoint.x + (cosValue * radius), centerPoint.y + (sinValue * radius))

  @normalizePath: (path) ->
    bBox = Raphael.pathBBox(path)

    theMatrix = new Raphael.matrix()
    theMatrix.translate(-bBox.x, -bBox.y)

    transformString = theMatrix.toTransformString()
    path = Raphael.transformPath(path, transformString)

    return path

  @scalePath: (path, amountX, amountY) ->
    theMatrix = new Raphael.matrix()
    theMatrix.scale(amountX, amountY)

    transformString = theMatrix.toTransformString()
    path = Raphael.transformPath(path, transformString)

    return path

  @translatePath: (path, amountX, amountY) ->
    theMatrix = new Raphael.matrix()
    theMatrix.translate(amountX, amountY)

    transformString = theMatrix.toTransformString()
    path = Raphael.transformPath(path, transformString)

    return path

  @rotatePath: (path, degrees) ->
    bBox = Raphael.pathBBox(path)

    theMatrix = new Raphael.matrix()
    theMatrix.rotate(degrees, bBox.x + (bBox.width / 2), bBox.y + (bBox.height / 2))

    transformString = theMatrix.toTransformString()
    path = Raphael.transformPath(path, transformString)

    return path

  @circleWithFourPoints: (x, y, r) ->
    centerPoint = new AmoebaSB.Point(x, y)
    result = undefined

    _.each([0, 90, 180, 270, 360], (degrees) =>
      point = @pointForAngle(degrees, r, centerPoint)

      if (result?)
        result += "A#{r},#{r},0,0,1,#{point.x},#{point.y}"
      else
        result = "M#{x+r}, #{y}"
    )

    if result?
      result += "z"

      # want it to match our rectangle points
      result = @rotatePath(result, -135)

    return result

  @rectWithFourPoints: (x, y, w, h) ->
    result = "M#{x}, #{y}"

    result += "l#{w}, 0"
    result += "l0, #{h}"
    result += "l#{-w}, 0"
    result += "l0, #{-h}"

    return result

  @trianglePath: (x, y, x1, y1, x2, y2) ->
    result = "M" + x + "," + y;

    result += "L" + x1 + "," + y1;
    result += "L" + x2 + "," + y2;

    return result;
