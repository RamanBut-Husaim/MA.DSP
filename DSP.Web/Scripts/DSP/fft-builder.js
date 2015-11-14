var FFTBuilder = (function() {

    function FFTBuilder() {
    }

    FFTBuilder.prototype.create = function(bufferSize, sampleRate) {
        return new FFT(bufferSize, sampleRate);
    }

    return FFTBuilder;
})();
