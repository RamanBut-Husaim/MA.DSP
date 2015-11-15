var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Dsp;
(function (Dsp) {
    var SpectrumChartBuilder = (function () {
        function SpectrumChartBuilder() {
        }
        SpectrumChartBuilder.prototype.create = function (chartData) {
            var dataProvider = new SpectrumDataProvider(chartData.signalMetadata, chartData.points);
            var chartInfo = new Dsp.ChartInfo();
            chartInfo.seriesName = "Values";
            chartInfo.title = "Spectrum";
            chartInfo.yAxisTitle = "Amplitude";
            chartInfo.chartType = "column";
            var configurationBuilder = new Dsp.WindowChartConfigurationBuilder(chartInfo, dataProvider);
            return new Dsp.WindowChart(chartData, configurationBuilder);
        };
        return SpectrumChartBuilder;
    })();
    Dsp.SpectrumChartBuilder = SpectrumChartBuilder;
    var SpectrumDataProvider = (function (_super) {
        __extends(SpectrumDataProvider, _super);
        function SpectrumDataProvider(signalMetadata, points) {
            _super.call(this);
            this._sampleRate = signalMetadata.dataSize / signalMetadata.totalReceiveTime;
            this._frequencyDefinition = signalMetadata.frequencyDefinition;
            this._fftBuilder = new FFTBuilder();
            this._dataPointMap = {};
            this.initialize(points);
        }
        SpectrumDataProvider.prototype.initialize = function (points) {
            var fft = this._fftBuilder.create(points.length, this._sampleRate);
            fft.forward(points.map(function (p) { return p.amplitude; }));
            this._dataPoints = new Array();
            for (var i = 0; i < fft.spectrum.length; ++i) {
                var dataPoint = new Dsp.DataPoint(i * this._frequencyDefinition, i, fft.spectrum[i]);
                this._dataPoints.push(dataPoint);
                this._dataPointMap[i.toString()] = dataPoint;
            }
        };
        Object.defineProperty(SpectrumDataProvider.prototype, "dataPoints", {
            get: function () {
                return this._dataPoints;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SpectrumDataProvider.prototype, "dataMap", {
            get: function () {
                return this._dataPointMap;
            },
            enumerable: true,
            configurable: true
        });
        return SpectrumDataProvider;
    })(Dsp.ChartDataProviderBase);
})(Dsp || (Dsp = {}));
//# sourceMappingURL=dsp-chart-spectrum.js.map