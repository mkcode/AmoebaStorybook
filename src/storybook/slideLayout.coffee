# Give it a height and width and this will return positions and transitions for elememnts within this stage

class AmoebaSB.SlideLayout
  constructor: (@$stage, @$stageHolder) ->
    @slideInset = 20

    @stageWidth = 960
    @stageHeight = 720

    @slideWidth = @stageWidth - @slideInset
    @slideHeight = @stageHeight - @slideInset

    # rescale stage when window is resized
    document.addEventListener(AmoebaSB.eventHelper.resizeEventName, (event) =>
      this._adjustStage()
    )

    this._setupStage(@$stage)
    this._adjustStage()

  center: (eWidth, eHeight, more) =>
    result =
      left: (@slideWidth - eWidth) / 2
      top: (@slideHeight - eHeight) / 2
      x: 0
      y: 0

    if more?
      result = _.extend(result, more)

    return result

  vertOffscreen: (up=true, more) =>
    result =
      y: if up then -window.innerHeight else window.innerHeight

    if more?
      result = _.extend(result, more)

    return result

  horizOffscreen: (left=true, more=undefined) =>
    result =
      x: if left then -window.innerWidth else window.innerWidth

    if more?
      result = _.extend(result, more)

    return result

  normal: (opacity=1) =>
    result =
      y: 0
      x: 0
      rotate: 0
      rotateY: 0
      skewX: 0
      skewY: 0
      rotateX: 0
      scale: 1
      opacity: opacity
      transformOrigin: '50% 50%'

    return result

  setupSlide: ($el) =>
    $el.css(
      position: "absolute"
      opacity: 0

      width: @slideWidth
      height: @slideHeight

#      border: "1px solid rgba(0, 0, 0, .1)"
#      backgroundColor: "rgba(255,255,255,0.8)"
#      borderRadius: 10
#      boxShadow: "0 2px 6px rgba(0, 0, 0, .4)"
    )

  _computeWindowScale: =>
    hScale = window.innerHeight / @stageHeight
    wScale = window.innerWidth / @stageWidth

    if (hScale > wScale)
      scale = wScale
    else
      scale = hScale

    if (scale > 1)
      scale = 1

    if (scale < 0)
      scale = 0

    return scale

  _setupStage: ($el) =>
    $el.css(
      top: 0
      left: 0
      position:"absolute"
      height: @slideHeight
      width: @slideWidth
      x: "-50%"
      y: "-50%"
      opacity: 1
      transformOrigin: "50% 50%"
    )

  _adjustStage: =>
    # create once lazily
    if not @internalScaleMethod?
      # setup scale to fit div once
      @$stageHolder.css(
        position:"absolute"
        top: "50%"
        left: "50%"
        transformOrigin: "top left"
        height: "100%"
        width: "100%"
      )

      @internalScaleMethod = _.throttle( =>
        windowScale = this._computeWindowScale()
        @$stageHolder.transition({ scale: windowScale }, 100)
      ,500)

    @internalScaleMethod()
