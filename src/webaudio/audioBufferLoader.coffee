class AmoebaSB.AudioBufferLoader
    constructor: (context, urlList, finished) ->
        @context = context
        @urlList = urlList
        @onload = finished
        @bufferList = new Array()
        @loadCount = 0

    load: () ->
        @loadBuffer(@urlList[i], i) for i in [0...@urlList.length]

    loadBuffer: (url, index) ->
        request = new XMLHttpRequest()
        request.open("GET", url, true)
        request.responseType = "arraybuffer"
        request.onload = () =>
            @context.decodeAudioData(
                request.response
                (buffer) => #decodeAudioData success
                    if(!buffer)
                        alert("error decoding file: " + url)
                        return
                    @bufferList[index] = buffer
                    # if(++@loadCount == @urlList.length)
                    @onload(@bufferList, index) if @onload?
                -> #decodeAudioData failure
                   alert("Audio Decoding Error"))

        request.onerror = () ->
            alert("XHR Error")

        request.send()
