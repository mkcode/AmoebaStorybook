
class AmoebaSB.NavigationControls
  constructor: (inNumSteps) ->
    @cssID = "navigationControls"
    @el = $("##{@cssID}")

    this._setupRadioButtons(inNumSteps)
    this._setupNextPrevButtons()

    # update selected radio button when slide changes
    document.addEventListener("slideTransitions:in", (event) =>
      theIndex = Number(event.detail)

      # select the radio button at this index
      $("input:radio[name=presentationRadioGroup]:nth(#{theIndex})").attr('checked',true)


      ratio = ( theIndex / ( inNumSteps - 1 ) )

      $(".progress").css(width: "#{ratio * window.innerWidth}px")
    )

    # progress bar at bottom
    $('<div/>')
      .appendTo(@el)
      .addClass("progress")
      .html('<span></span>')
      .click( (event) =>
        console.log("click on progress, needs implementation")
      )

  _setupRadioButtons: (inNumSteps) =>
    # make a containing div with layout css embedded
    theContainer = $('<div/>')
      .css({position: "absolute", width:"100%", bottom: "0px", left: "50%"})
      .appendTo(@el)

    _.each([0...inNumSteps], (theStep, index) =>
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

  _setupNextPrevButtons: (inNumSteps) =>
    theButton = $('<a/>')
      .attr({id: "nextButton"}) # , href: "presentation/1"})
      .appendTo(@el)

    theButton.click( (event) =>
      AmoebaSB.eventHelper.triggerEvent(document, AmoebaSB.eventHelper.nextKeyEventName)
    )

    theButton = $('<a/>')
      .attr({id: "prevButton"}) # , href: "presentation/2"})
      .appendTo(@el)

    theButton.click( (event) =>
      AmoebaSB.eventHelper.triggerEvent(document, AmoebaSB.eventHelper.prevKeyEventName)
    )
