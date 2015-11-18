var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Dsp;
(function (Dsp) {
    var DoubleIntegralChartBuilder = (function () {
        function DoubleIntegralChartBuilder() {
        }
        DoubleIntegralChartBuilder.prototype.create = function (chartData) {
            var dataProvider = new ChartDoubleIntegralDataProvider(chartData.signalMetadata, chartData.points);
            var chartInfo = new Dsp.ChartInfo();
            chartInfo.title = "Double Integral";
            chartInfo.yAxisTitle = "Amplitude";
            chartInfo.seriesName = "Values";
            chartInfo.chartType = "line";
            var chartConfigurationProvider = new Dsp.WindowChartConfigurationBuilder(chartInfo, dataProvider);
            return new Dsp.WindowChart(chartData, chartConfigurationProvider);
        };
        return DoubleIntegralChartBuilder;
    })();
    Dsp.DoubleIntegralChartBuilder = DoubleIntegralChartBuilder;
    var ChartDoubleIntegralDataProvider = (function (_super) {
        __extends(ChartDoubleIntegralDataProvider, _super);
        function ChartDoubleIntegralDataProvider(signalMetadata, points) {
            _super.call(this);
            this._signalMetadata = signalMetadata;
            this._integrationProcessor = new IntegrationProcessor(signalMetadata, points);
            this._dataMap = {};
            this.processPoints(points);
        }
        Object.defineProperty(ChartDoubleIntegralDataProvider.prototype, "dataPoints", {
            get: function () {
                return this._dataPoints;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ChartDoubleIntegralDataProvider.prototype, "dataMap", {
            get: function () {
                return this._dataMap;
            },
            enumerable: true,
            configurable: true
        });
        ChartDoubleIntegralDataProvider.prototype.processPoints = function (points) {
            this._dataPoints = new Array();
            for (var i = 0; i < points.length; ++i) {
                var point = points[i];
                var amplitude = this._integrationProcessor.calcualteValueForPoint(point);
                var dataPoint = new Dsp.DataPoint(point.frequency, point.frequency, amplitude);
                this._dataPoints.push(dataPoint);
                this._dataMap[dataPoint.xValue.toString()] = dataPoint;
            }
        };
        return ChartDoubleIntegralDataProvider;
    })(Dsp.ChartDataProviderBase);
    var HarmonicInfo = (function () {
        function HarmonicInfo() {
        }
        return HarmonicInfo;
    })();
    var IntegrationProcessor = (function () {
        function IntegrationProcessor(signalMetadata, points) {
            this._fftBuilder = new FFTBuilder();
            this._signalMetadata = signalMetadata;
            this._fftBuilder = new FFTBuilder();
            this._harmonicInfos = this.gatherHarmonicInfo(points);
            this._integrationConstant = this.calculateIntegrationConstant();
        }
        Object.defineProperty(IntegrationProcessor.prototype, "integrationConstant", {
            get: function () {
                return this._integrationConstant;
            },
            enumerable: true,
            configurable: true
        });
        IntegrationProcessor.prototype.calcualteValueForPoint = function (point) {
            var pointValue = 0;
            for (var i = 0; i < this._harmonicInfos.length; ++i) {
                var harmonicInfo = this._harmonicInfos[i];
                pointValue += (harmonicInfo.vibrationDistanceAmplitude * Math.cos(2 * Math.PI * harmonicInfo.frequency * point.frequency - harmonicInfo.distancePhase));
            }
            pointValue += this._integrationConstant;
            return pointValue;
        };
        IntegrationProcessor.prototype.gatherHarmonicInfo = function (points) {
            var sampleRate = this._signalMetadata.dataSize * this._signalMetadata.totalReceiveTime;
            var fft = this._fftBuilder.create(points.length, sampleRate);
            fft.forward(points.map(function (p) { return p.amplitude; }));
            var that = this;
            var harmonicInfos = new Array();
            for (var index = 1; index < fft.spectrum.length; ++index) {
                var harmonicInfo = new HarmonicInfo();
                harmonicInfo.amplitude = fft.spectrum[index];
                harmonicInfo.frequency = that._signalMetadata.frequencyDefinition * index;
                harmonicInfo.phase = Math.atan2(fft.imag[index], fft.real[index]);
                harmonicInfo.distancePhase = harmonicInfo.phase - Math.PI;
                harmonicInfo.vibrationDistanceAmplitude = fft.spectrum[index] / (4 * Math.PI * Math.PI * harmonicInfo.frequency * harmonicInfo.frequency);
                harmonicInfos.push(harmonicInfo);
            }
            return harmonicInfos;
        };
        IntegrationProcessor.prototype.calculateIntegrationConstant = function () {
            var integrationConstant = 0;
            for (var i = 0; i < this._harmonicInfos.length; ++i) {
                var velocityPhase = this._harmonicInfos[i].phase - Math.PI / 2;
                integrationConstant += (this._harmonicInfos[i].vibrationDistanceAmplitude * Math.sin(velocityPhase));
            }
            return integrationConstant;
        };
        return IntegrationProcessor;
    })();
})(Dsp || (Dsp = {}));
//# sourceMappingURL=dsp-chart-double-integral.js.map