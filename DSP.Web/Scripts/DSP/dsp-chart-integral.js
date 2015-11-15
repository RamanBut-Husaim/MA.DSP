var Dsp;
(function (Dsp) {
    var IntegralChartData = (function () {
        function IntegralChartData() {
        }
        return IntegralChartData;
    })();
    Dsp.IntegralChartData = IntegralChartData;
    var ChartIntegralDataProvider = (function () {
        function ChartIntegralDataProvider(signalMetadata, points) {
            this._signalMetadata = signalMetadata;
            this._fftBuilder = new FFTBuilder();
            this.processPoints(points);
        }
        ChartIntegralDataProvider.prototype.processPoints = function (points) {
            var harmonicInfos = this.gatherHarmonicInfo(points);
        };
        ChartIntegralDataProvider.prototype.gatherHarmonicInfo = function (points) {
            var sampleRate = this._signalMetadata.dataSize * this._signalMetadata.totalReceiveTime;
            var fft = this._fftBuilder.create(points.length, sampleRate);
            fft.forward(points.map(function (p) { return p.amplitude; }));
            var that = this;
            var harmonicInfos = new Array();
            for (var index = 1; index < fft.spectrum.length; ++index) {
                var harmonicInfo = new HarmonicInfo();
                harmonicInfo.amplitude = fft.spectrum[index];
                harmonicInfo.frequency = that._signalMetadata.frequencyDefinition * index;
                harmonicInfo.phase = Math.atan2(fft.imag[index], fft.real[index]) - Math.PI / 2;
                harmonicInfo.vibrationVelocityAmplitude = fft.spectrum[index] / (2 * Math.PI * harmonicInfo.frequency);
                harmonicInfos.push(harmonicInfo);
            }
            return harmonicInfos;
        };
        return ChartIntegralDataProvider;
    })();
    Dsp.ChartIntegralDataProvider = ChartIntegralDataProvider;
    var HarmonicInfo = (function () {
        function HarmonicInfo() {
        }
        return HarmonicInfo;
    })();
})(Dsp || (Dsp = {}));
