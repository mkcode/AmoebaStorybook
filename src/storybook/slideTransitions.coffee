class AmoebaSB.SlideTransitions
  constructor: (@slides) ->
    @duration = 1000

  nextIndex: () =>
    return this._nextStepIndex(true)

  prevIndex: () =>
    return this._nextStepIndex(false)

  goto: (theIndex) =>
    theIndex = this._validStepIndex(theIndex)

    if @activeStepIndex?
      goingBack = theIndex < @activeStepIndex

    if (theIndex != @activeStepIndex)
      if @activeStepIndex?
        # this is undefined the first time, we don't transition and animate for this case, so just pass undefined to run
        # and it will do the right thing
        active = this._slideAtIndex(@activeStepIndex)

      @activeStepIndex = theIndex
      next = this._slideAtIndex(@activeStepIndex)

      # events are sent after the animation is finished
      sendEventsCallback = =>
        this._sendEvents(active, next, true)

      if next? && active?
        # if going backwards, just slide back
        if goingBack
          this._transitionSpec('previous').run(active, next, sendEventsCallback)
        else
          this._transitionSpec(next.transition).run(active, next, sendEventsCallback)
      else
        # just put in the next slide, this happens on initial page load/refresh
        next.el.css(AmoebaSB.layout.normal())
        sendEventsCallback()

      this._sendEvents(active, next, false)

# just an experiment, remove if not used in the future
#      if ((theIndex % 2) == 0)
#        $("#presentationBackColor").transition(backgroundColor: "rgba(255,2,2,0.4)")
#      else
#        $("#presentationBackColor").transition(backgroundColor: "rgba(0,0,0,0)")

  # ===============
  # Private methods
  # ===============

  _validStepIndex: (theIndex) =>
    if theIndex < 0
      theIndex = 0
    else if theIndex >= @slides.length
      theIndex = @slides.length - 1

    return theIndex

  _nextStepIndex: (nextFlag) =>
    theIndex = @activeStepIndex

    if theIndex != -1
      if nextFlag
        theIndex += 1
      else
        theIndex -= 1

    return this._validStepIndex(theIndex)

  _slideAtIndex: (theIndex) =>
    theIndex = this._validStepIndex(theIndex)

    return @slides[theIndex]

  _sendEvents: (active, next, afterTransitionComplete) =>
    if active?
      active.slideOutEvent(afterTransitionComplete)

      # only sending out the slideTransition event before transition complete (navigation bar needs instant update)
      if !afterTransitionComplete
        AmoebaSB.eventHelper.triggerEvent(active.el.get(0), "slideTransitions:out", @slides.indexOf(active))

    if next?
      next.slideInEvent(afterTransitionComplete)

      # only sending out the slideTransition event before transition complete (navigation bar needs instant update)
      if !afterTransitionComplete
        AmoebaSB.eventHelper.triggerEvent(next.el.get(0), "slideTransitions:in", @slides.indexOf(next))

  _transitionSpec: (theID) =>
    switch (theID)
      when 'zoom'
        spec = this._zoomTransitionSpec()
      when 'next'
        spec = this._slideTransitionSpec(false)
      when 'previous'
        spec = this._slideTransitionSpec(true)
      when 'down'
        spec = this._dropTransitionSpec(false)
      when 'up'
        spec = this._dropTransitionSpec(true)
      when 'fade'
        spec = this._fadeTransitionSpec()
      when 'warp'
        spec = this._warpTransitionSpec()
      when 'rotate'
        spec = this._rotateTransitionSpec()
      else
        console.log("not found: #{theID}")

    return spec

  # ================
  # Transition Specs
  # ================

  _slideTransitionSpec: (left=false) =>
    result = new SlideTransition(AmoebaSB.layout.horizOffscreen(left))

    result.addActive(AmoebaSB.layout.horizOffscreen(!left, { opacity: 0 }))

    result.finalize(
      duration: @duration
    )

    return result

  _dropTransitionSpec: (up=true) =>
    result = new SlideTransition(AmoebaSB.layout.vertOffscreen(up))

    result.addActive(AmoebaSB.layout.vertOffscreen(!up, { opacity: 0 }))

    result.finalize(
      duration: @duration
    )

    return result

  _fadeTransitionSpec: () =>
    result = new SlideTransition(
      opacity: 0
    )

    # active slide
    result.addActive(
      opacity: 0
    )

    result.finalize(
      duration: @duration
    )

    return result

  _warpTransitionSpec: () =>
    winWidth = window.innerWidth

    result = new SlideTransition(
      scale: 0.4
      x: -winWidth
    )

    # active slide
    result.addActive(
      opacity: 0.8
      scale: 0.4
    )
    result.addActive(
      opacity: 0
      skewX: 80
      x: winWidth
    )

    # next slide
    result.addNext(
      opacity: 1
      x: 0
      delay: @duration/2
    )

    # timing for final position
    result.finalize(
      duration: @duration
    )

    return result

  _zoomTransitionSpec: () =>
    result = new SlideTransition(
      opacity: 0
      scale: 0
      rotate:60
    )

    # active slide
    result.addActive(
      opacity: 0.5
      scale: 1.5
      easing: 'out',
      duration: @duration*.2
    )

    result.addActive(
      opacity: 0
      scale: 0
      easing: 'ease',
      duration: @duration*.8
    )

    # next slide
    result.finalize(
      delay: 300
      duration: @duration
    )

    return result

  _rotateTransitionSpec: () =>
    result = new SlideTransition(
      opacity: 0
      rotate: -180
    )

    # active slide
    result.addActive(
      opacity: 0
      rotate: 180
    )

    # rotate needs a custom origin
    result.setTransformOrigin('50% 100%')

    result.finalize(
      duration: @duration
    )

    return result

  # ====================================
  # SlideTransition
  # ====================================

  class SlideTransition
    constructor: (@nextSlideState) ->
      @_nextArray = []
      @_activeArray = []

    run: (active, next, callback) =>
      if active? and next?

        @completeCallback = callback

        next.el.css($.extend(AmoebaSB.layout.normal(0), @nextSlideState))

        # do we have a custom transform origin?
        if @transformOrigin?
          active.el.css(
            transformOrigin: @transformOrigin
          )
          next.el.css(
            transformOrigin: @transformOrigin
          )

        _.each(@_activeArray, (trans, index) =>
          active.el.transition(trans)
        )

        # animate next slide
        _.each(@_nextArray, (trans, index) =>
          next.el.transition(trans)
        )
      else
        console.log("SlideTransition run: bad parameter")

    addNext: (obj) ->
      @_nextArray.push(obj)

    addActive: (obj) ->
      @_activeArray.push(obj)

    setTransformOrigin: (origin) =>
      @transformOrigin = origin

    finalize: (finalParams) =>
      # every transition ends up at the normal position, so add that here
      finalPosition = AmoebaSB.layout.normal()
      if finalParams?
        finalPosition = $.extend(finalPosition, finalParams)

      callback = =>
        if @completeCallback?
          @completeCallback()

      # add callback on nextSlide so we can send the slideIn and slideOut events
      finalPosition = $.extend(finalPosition, {complete: callback})

      @_nextArray.push(finalPosition)

      # last step for active is to display: none
      @_activeArray.push(
        display: 'none'
      )
