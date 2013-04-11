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
    constructor: (@webAudioAPI, @buffer, @transition) ->
        @source = @webAudioAPI.createBufferSource()
        @source.buffer = @buffer
        @source.connect(@webAudioAPI.destination)
        @source.loop = true

    play: (time) ->
        @source.noteOn(time)

    stop: () ->
        @source.noteOff(0)




class AmoebaSB.SlideAudioTransitions
    constructor: (@slides) ->
        console.log(@slides)
        @webAudioAPI = AmoebaSB.WebAudioAPI.getContext()
        urls = (slide.sound_url for slide in @slides)
        @bufferLoader = new AmoebaSB.AudioBufferLoader(@webAudioAPI, urls, @finishedLoading)
        @bufferLoader.load()
        @audioSlides = new Array()
        @currentSlidePlaying = -1
        @currentLoopStartTime = 0

    finishedLoading: (bufferList, index) =>
        transition = if @slides[index].sound_transition? then @slides[index].sound_transition else "queue"
        audioSlide = new AmoebaSB.SlideAudio(@webAudioAPI, bufferList[index], transition)
        @audioSlides[index] = audioSlide
        console.log(audioSlide)

    playSlideAt: (slideIndex, time) ->
        @currentSlidePlaying = slideIndex
        @currentLoopStartTime = time
        @audioSlides[slideIndex].play(@currentLoopStartTime)
        console.log("Loop Start Time: " + @currentLoopStartTime)


    goto: (slideIndex) ->
        _.when (=> @audioSlides[slideIndex]), =>
            audioSlide = @audioSlides[slideIndex]
            console.log("RRR" + @currentSlidePlaying)
            if @currentSlidePlaying == -1
                @_immidiateTransition(slideIndex)
                return
            console.log(audioSlide)

            if audioSlide.transition == "queue"
                @_queueTransition(slideIndex)
            else if audioSlide.transition == "immediate"
                @_immidiateTransition(slideIndex)

            console.log("Audio move!!")

    _queueTransition: (slideIndex) ->
        console.log(@audioSlides[@currentSlidePlaying].source)
        curSlide = @audioSlides[@currentSlidePlaying]
        curSlide.source.loop = false
        @playSlideAt(slideIndex, @webAudioAPI.currentTime + curSlide.buffer.duration)

    _immidiateTransition: (slideIndex) ->
        _.each(@audioSlides, (slide, index) =>
             slide.stop()
        )
        @playSlideAt(slideIndex, @webAudioAPI.currentTime)
