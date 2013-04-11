#= require ../webaudio/webaudio
#= require ../webaudio/audioBufferLoader


# Dead simple async managment
#
# _.when (-> variable == "ready"), ->
#      alert "Hooray!, I am always " + variable
#
_.mixin
    'when': (test, goCallback, interval = 50) ->
        if test()
            goCallback()
        else
            setTimeout (-> _.when(test, goCallback, interval)), interval



class AmoebaSB.SlideAudio
    constructor: (@webAudioAPI, @buffer) ->
        @source = @webAudioAPI.createBufferSource()
        @source.buffer = @buffer
        @source.connect(@webAudioAPI.destination)
        @source.loop = true

    play: () ->
        @source.noteOn(0)

    stop: () ->
        @source.noteOff(0)




class AmoebaSB.SlideAudioTransitions
    constructor: (@slides) ->
        console.log("Setting up audio transitions")
        @webAudioAPI = AmoebaSB.WebAudioAPI.getContext()
        @bufferLoader = new AmoebaSB.AudioBufferLoader(@webAudioAPI, ["/sounds/intro-loop.mp3","/sounds/rythym-loop.mp3", "/sounds/rythym-loop2.mp3", "/sounds/chorus-loop.mp3"], @finishedLoading)
        @bufferLoader.load()
        @audioSlides = new Array()

    finishedLoading: (bufferList, index) =>
        audioSlide = new AmoebaSB.SlideAudio(@webAudioAPI, bufferList[index])
        console.log(audioSlide)
        # alert(index)
        @audioSlides[index] = audioSlide

    goto: (slideIndex) ->
        console.log(slideIndex)
        _.each(@audioSlides, (slide, index) =>
            slide.stop()
        )

        _.when (=> @audioSlides[slideIndex]), =>
            @audioSlides[slideIndex].play();

        console.log("Audio move!!")
