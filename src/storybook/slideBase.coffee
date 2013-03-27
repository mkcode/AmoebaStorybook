
class AmoebaSB.Slide_Base
  constructor: ->
    # subclasses should set these
    @cssID = "????"
    @transition = 'fade'

    this.setup()

  setup: ->
    console.log("must subclass and implement setup")

  next: =>
    # subclass and return true if you want to handle next
    return false

  previous: =>
    # subclass and return true if you want to handle next
    return false

  pause: =>
    # subclass and return true if you want to handle next
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

  # call this to set things up inside your setup override
  _setupElement: (theID) =>
    @cssID = theID
    @el = $("##{@cssID}")
    AmoebaSB.layout.setupSlide(@el)

  # call this when slide is done animating, or call with an appropriate timeout
  # to give the user time to read the text.  This will autoadvance to the next slide
  _slideIsDone: (delay) =>
    # don't go to next slide if paused
    if AmoebaSB.eventHelper.paused
      return

    # don't do anything if we are not the current slide, could be called when the current
    # slide has changed, but a previous call back is called before old card is torn down
    if @activeSlide
      if delay?
        setTimeout(=>
          # again make sure we are the current slide after the timeout
          if @activeSlide
            AmoebaSB.eventHelper.triggerEvent(document, AmoebaSB.eventHelper.nextKeyEventName)
        , delay)
      else
        AmoebaSB.eventHelper.triggerEvent(document, AmoebaSB.eventHelper.nextKeyEventName)
