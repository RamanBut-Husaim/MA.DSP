var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Dsp;
(function (Dsp) {
    var SpectrumChartData = (function () {
        function SpectrumChartData() {
        }
        return SpectrumChartData;
    })();
    Dsp.SpectrumChartData = SpectrumChartData;
    var SpectrumChart = (function (_super) {
        __extends(SpectrumChart, _super);
        function SpectrumChart(chartData) {
            _super.call(this);
            this._containerId = chartData.containerId;
            this._sampleRate = chartData.sampleRate;
            this._pointNumber = chartData.points.length;
            this._points = chartData.points;
            this._dataProvider = new SpectrumDataProvider(this._points, this._sampleRate);
            this._chartConfigurationBuilder = new SpectrumChartConfiguraitonBuilder(this, this._dataProvider);
        }
        Object.defineProperty(SpectrumChart.prototype, "containerId", {
            get: function () {
                return this._containerId;
            },
            enumerable: true,
            configurable: true
        });
        SpectrumChart.prototype.draw = function () {
            $('#' + this._containerId).highcharts(this._chartConfigurationBuilder.createConfiguration());
        };
        return SpectrumChart;
    })(Dsp.ChartBase);
    Dsp.SpectrumChart = SpectrumChart;
    var SpectrumDataProvider = (function (_super) {
        __extends(SpectrumDataProvider, _super);
        function SpectrumDataProvider(points, sampleRate) {
            _super.call(this);
            this._points = points;
            this._sampleRate = sampleRate;
            this._fftBuilder = new FFTBuilder();
            this._dataPointMap = {};
            this.initialize();
        }
        SpectrumDataProvider.prototype.initialize = function () {
            var fft = this._fftBuilder.create(this._points.length, this._sampleRate);
            fft.forward(this._points);
            this._dataPoints = new Array();
            for (var i = 0; i < fft.spectrum.length; ++i) {
                var dataPoint = new Dsp.DataPoint(i * 1 / this._sampleRate, i, fft.spectrum[i]);
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
    var SpectrumChartConfiguraitonBuilder = (function (_super) {
        __extends(SpectrumChartConfiguraitonBuilder, _super);
        function SpectrumChartConfiguraitonBuilder(chart, dataProvider) {
            _super.call(this);
            this._chart = chart;
            this._dataProvider = dataProvider;
        }
        Object.defineProperty(SpectrumChartConfiguraitonBuilder.prototype, "chartDataProvider", {
            get: function () {
                return this._dataProvider;
            },
            enumerable: true,
            configurable: true
        });
        SpectrumChartConfiguraitonBuilder.prototype.createConfiguration = function () {
            var that = this;
            var result = {
                chart: {
                    zoomType: "x",
                    type: "column"
                },
                title: {
                    test: "Spectrum"
                },
                yAxis: {
                    title: {
                        text: "Amplitude"
                    }
                },
                tooltip: {
                    pointFormatter: function () {
                        return that.formatPoint(this);
                    }
                },
                legend: {
                    enabled: false
                },
                series: [
                    {
                        name: "Values",
                        data: that._dataProvider.points
                    }
                ]
            };
            return result;
        };
        return SpectrumChartConfiguraitonBuilder;
    })(Dsp.ChartConfigurationBuilderBase);
})(Dsp || (Dsp = {}));
//# sourceMappingURL=dsp-chart-spectrum.js.map