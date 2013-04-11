class AmoebaSB.WebAudioAPI
    @initContext: () =>
        if AudioContext?
            @context = new AudioContext()
        else if webkitAudioContext?
            @context = new webkitAudioContext()
        else
            throw new Error('AudioContext not supported.')

    @getContext: () =>
        @initContext() unless @context?
        return @context
