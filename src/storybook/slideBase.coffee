
class AmoebaSB.Slide_Base
  constructor: ->
    # subclasses should set these
    @stepIndex = 0
    @previousStepIndex = 0
    @numSteps = 0
    @cssID = "????"
    @transition = 'fade'

    this.setup()

  setup: ->
    console.log("must subclass and implement setup")

  next: =>
    if @stepIndex < (@numSteps - 1)
      @stepIndex++
      this._update()

      return true

    return false

  # !! subclasses don't call or override this, override slideOut instead
  # this avoids having to call super in slideOut
  slideOutEvent: (afterTransitionComplete) =>
    @activeSlide = false
    this.slideOut(afterTransitionComplete)

  # !! subclasses don't call or override this, override slideIn instead
  # this avoids having to call super in slideOut
  slideInEvent: (afterTransitionComplete) =>
    @activeSlide = true
    this.slideIn(afterTransitionComplete)

  slideOut: (afterTransitionComplete) =>
    # subclasses override to get notified

  slideIn: (afterTransitionComplete) =>
    # subclasses override to get notified

  _update: =>
    console.log("must subclass and implement _update")

  _setupElement: (theID) =>
    @cssID = theID
    @el = $("##{@cssID}")
    AmoebaSB.layout.setupSlide(@el)

