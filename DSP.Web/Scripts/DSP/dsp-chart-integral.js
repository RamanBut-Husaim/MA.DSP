var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Dsp;
(function (Dsp) {
    var IntegralChartData = (function () {
        function IntegralChartData() {
        }
        return IntegralChartData;
    })();
    Dsp.IntegralChartData = IntegralChartData;
    var ChartIntegralDataProvider = (function (_super) {
        __extends(ChartIntegralDataProvider, _super);
        function ChartIntegralDataProvider(signalMetadata, points) {
            _super.call(this);
            this._signalMetadata = signalMetadata;
            this._integrationProcessor = new IntegrationProcessor(signalMetadata, points);
            this._dataMap = {};
            this.processPoints(points);
        }
        Object.defineProperty(ChartIntegralDataProvider.prototype, "dataPoints", {
            get: function () {
                return this._dataPoints;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ChartIntegralDataProvider.prototype, "dataMap", {
            get: function () {
                return this._dataMap;
            },
            enumerable: true,
            configurable: true
        });
        ChartIntegralDataProvider.prototype.processPoints = function (points) {
            var resultPoints = new Array();
            for (var i = 0; i < points.length; ++i) {
                var point = points[i];
                var amplitude = this._integrationProcessor.calcualteValueForPoint(point);
                var dataPoint = new Dsp.DataPoint(point.frequency, point.frequency, amplitude);
                resultPoints.push(dataPoint);
                this._dataMap[dataPoint.xValue.toString()] = dataPoint;
            }
        };
        return ChartIntegralDataProvider;
    })(Dsp.ChartDataProviderBase);
    Dsp.ChartIntegralDataProvider = ChartIntegralDataProvider;
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
                pointValue += (harmonicInfo.vibrationVelocityAmplitude * Math.cos(2 * Math.PI * harmonicInfo.frequency * point.frequency - harmonicInfo.velocityPhase));
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
                harmonicInfo.velocityPhase = harmonicInfo.phase - Math.PI / 2;
                harmonicInfo.vibrationVelocityAmplitude = fft.spectrum[index] / (2 * Math.PI * harmonicInfo.frequency);
                harmonicInfos.push(harmonicInfo);
            }
            return harmonicInfos;
        };
        IntegrationProcessor.prototype.calculateIntegrationConstant = function () {
            var integrationConstant = 0;
            for (var i = 0; i < this._harmonicInfos.length; ++i) {
                integrationConstant += (this._harmonicInfos[i].vibrationVelocityAmplitude * Math.sin(this._harmonicInfos[i].phase));
            }
            return integrationConstant;
        };
        return IntegrationProcessor;
    })();
})(Dsp || (Dsp = {}));
//# sourceMappingURL=dsp-chart-integral.js.map