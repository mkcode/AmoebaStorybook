
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
      @previousStepIndex = @stepIndex

      @stepIndex++
      this._update()

      return true

    return false

  previous: =>
    if @stepIndex > 0
      @previousStepIndex = @stepIndex

      @stepIndex--
      this._update()

      return true

    return false

  slideOut: =>
#    console.log("slideOut: #{this.cssID}")

  slideIn: =>
#    console.log("slideIn: #{this.cssID}")

  _update: =>
    console.log("must subclass and implement _update")

  _setupElement: (theID) =>
    @cssID = theID
    @el = $("##{@cssID}")
    AmoebaSB.layout.setupSlide(@el)

