
class AmoebaSB.NavigationControls
  constructor: (@numSteps) ->
    @cssID = "navigationControls"
    @el = $("##{@cssID}")

    this._setupRadioButtons()
    this._setupNextPrevButtons()

    # update selected radio button when slide changes
    document.addEventListener("slideTransitions:in", (event) =>
      theIndex = Number(event.detail)

      # select the radio button at this index
      $("input:radio[name=presentationRadioGroup]:nth(#{theIndex})").attr('checked',true)

      ratio = theIndex / (@numSteps - 1)

      $("#progressBar span").css(width: "#{ratio * window.innerWidth}px")
    )

    # progress bar at bottom
    $('<div/>')
      .appendTo(@el)
      .attr({id: "progressBar"})
      .html('<span></span>')
      .click( (event) =>
        slideIndex = Math.floor( ( event.clientX / @el.get(0).offsetWidth ) * @numSteps)
        AmoebaSB.eventHelper.triggerEvent(document, "navigateToIndexEventName", slideIndex)
      )

  _setupRadioButtons: () =>
    # make a containing div with layout css embedded
    theContainer = $('<div/>')
      .css({position: "absolute", width:"100%", bottom: "0px", left: "50%"})
      .appendTo(@el)

    _.each([0...@numSteps], (theStep, index) =>
      theRadio = $('<input/>')
        .attr({type: "radio", name: "presentationRadioGroup", value: theStep})
        .appendTo(theContainer)

      # check first radio
      if theStep == 0
        theRadio.attr({checked: ""})
    )

    $("input[name=presentationRadioGroup]:radio").change(() ->   # need this as button clicked
      theValue = $(this).val()

      # couldn't use the constant in the object, our this is the button.  how best to fix this?
      AmoebaSB.eventHelper.triggerEvent(document, "navigateToIndexEventName", theValue)
    )

  _setupNextPrevButtons: () =>
    theButton = $('<a/>')
      .attr({id: "nextButton"})
      .appendTo(@el)

    theButton.click( (event) =>
      AmoebaSB.eventHelper.triggerEvent(document, AmoebaSB.eventHelper.nextKeyEventName)
    )

    theButton = $('<a/>')
      .attr({id: "prevButton"})
      .appendTo(@el)

    theButton.click( (event) =>
      AmoebaSB.eventHelper.triggerEvent(document, AmoebaSB.eventHelper.prevKeyEventName)
    )
