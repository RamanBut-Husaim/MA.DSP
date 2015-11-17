// <reference path="../typings/highcharts/highstock.d.ts"
// <reference path="../typings/highcharts/highcharts.d.ts"
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Dsp;
(function (Dsp) {
    // all this stuff should be refactored. Became a mess.
    var Chart = (function (_super) {
        __extends(Chart, _super);
        function Chart(containerId, seriesId, jsonData) {
            _super.call(this);
            this._containerId = containerId;
            this._spectrumChartBuilder = new Dsp.SpectrumChartBuilder();
            this._integralChartBuilder = new Dsp.IntegralChartBuilder();
            this._integralSpectrumChartBuilder = new Dsp.IntegralSpectrumChartBuilder();
            this._chartData = new ChartDataProvider(seriesId, jsonData);
            this._characteristicCalculator = new Dsp.CharacteristicCalculator(this._chartData.dataPoints);
        }
        Object.defineProperty(Chart.prototype, "containerId", {
            get: function () {
                return this._containerId;
            },
            enumerable: true,
            configurable: true
        });
        Chart.prototype.draw = function () {
            var that = this;
            this._chartBuilder = new ChartConfigurationBuilder(this._chartData, this);
            $('#' + this._containerId).highcharts("StockChart", this._chartBuilder.createConfiguration());
        };
        Chart.prototype.characteristicUpdater = function (startPoint, endPoint) {
            this._characteristicResult = this._characteristicCalculator.calculate(startPoint, endPoint);
            this.setupCharecteristics();
            this.cleanUpCharts();
            var windowPoints = this.getWindowsPoints();
            this._spectrumChart = this._spectrumChartBuilder.create({
                containerId: this._containerId + "_spectrum",
                points: windowPoints,
                signalMetadata: this._chartData.signalMetadata
            });
            this._integralChart = this._integralChartBuilder.create({
                containerId: this._containerId + "_integral",
                points: windowPoints,
                signalMetadata: this._chartData.signalMetadata
            });
            this._integralSpectrumChart = this._integralSpectrumChartBuilder.create({
                containerId: this._containerId + "_integral_spectrum",
                points: this._integralChart.chartConfigurationBuilder.chartDataProvider.dataPoints,
                signalMetadata: this._chartData.signalMetadata
            });
            this._spectrumChart.draw();
            this._integralChart.draw();
            this._integralSpectrumChart.draw();
        };
        Chart.prototype.setupCharecteristics = function () {
            this._chartData.characteristics.maxValue = this._characteristicResult.maxValue;
            this._chartData.characteristics.minValue = this._characteristicResult.minValue;
            this._chartData.characteristics.peakFactor = this._characteristicResult.peakFactor;
            this._chartData.characteristics.peekToPeek = this._characteristicResult.peekToPeek;
            this._chartData.characteristics.standardDeviation = this._characteristicResult.standardDeviation;
        };
        Chart.prototype.getWindowsPoints = function () {
            if (!this._characteristicResult) {
                return new Array();
            }
            var points = new Array();
            var endIndex = this._characteristicResult.window.startIndex + this._characteristicResult.window.size;
            for (var i = this._characteristicResult.window.startIndex; i < endIndex; ++i) {
                points.push(this._chartData.dataPoints[i]);
            }
            return points;
        };
        Chart.prototype.cleanUpCharts = function () {
            if (this._spectrumChart) {
                this._spectrumChart.destroy();
            }
            if (this._integralChart) {
                this._integralChart.destroy();
            }
            if (this._integralSpectrumChart) {
                this._integralSpectrumChart.destroy();
            }
            var validCharts = new Array();
            $.each(Highcharts.charts, function (index, chart) {
                if (chart != undefined) {
                    validCharts.push(chart);
                }
            });
            Highcharts.charts.length = 0;
            validCharts.forEach(function (chart) { return Highcharts.charts.push(chart); });
        };
        return Chart;
    })(Dsp.ChartBase);
    Dsp.Chart = Chart;
    var ChartDataProvider = (function (_super) {
        __extends(ChartDataProvider, _super);
        function ChartDataProvider(seriesId, jsonObject) {
            _super.call(this);
            this._fileName = jsonObject.FileName;
            this._characteristics = new Dsp.Characteristics(seriesId, jsonObject.Characteristics);
            this._signalMetadata = new SignalMetadata(jsonObject.SignalMetadata);
            this._data = new Array();
            this._dataPointMap = {};
            this._sampleRate = this._signalMetadata.dataSize / this._signalMetadata.totalReceiveTime;
            this.initializeData(jsonObject);
        }
        ChartDataProvider.prototype.initializeData = function (jsonData) {
            var time = (new Date()).getTime();
            var frequency = 0;
            var frequencyStep = this._signalMetadata.totalReceiveTime / this._signalMetadata.dataSize;
            var timeStep = 1000;
            var that = this;
            $.each(jsonData.Points, function (index, element) {
                var point = new Dsp.DataPoint(frequency, time, element.Y);
                that._data.push(point);
                that._dataPointMap[time.toString()] = point;
                frequency += frequencyStep;
                time += timeStep;
            });
        };
        Object.defineProperty(ChartDataProvider.prototype, "fileName", {
            get: function () {
                return this._fileName;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ChartDataProvider.prototype, "characteristics", {
            get: function () {
                return this._characteristics;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ChartDataProvider.prototype, "dataPoints", {
            get: function () {
                return this._data;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ChartDataProvider.prototype, "dataMap", {
            get: function () {
                return this._dataPointMap;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ChartDataProvider.prototype, "signalMetadata", {
            get: function () {
                return this._signalMetadata;
            },
            enumerable: true,
            configurable: true
        });
        return ChartDataProvider;
    })(Dsp.ChartDataProviderBase);
    var ChartConfigurationBuilder = (function (_super) {
        __extends(ChartConfigurationBuilder, _super);
        function ChartConfigurationBuilder(chartData, chart) {
            _super.call(this);
            this._chartData = chartData;
            this._chart = chart;
        }
        Object.defineProperty(ChartConfigurationBuilder.prototype, "chartDataProvider", {
            get: function () {
                return this._chartData;
            },
            enumerable: true,
            configurable: true
        });
        ChartConfigurationBuilder.prototype.createConfiguration = function () {
            var that = this;
            var buttons = this.generateButtons();
            var result = {
                chart: {
                    zoomType: "x"
                },
                rangeSelector: {
                    buttonSpacing: 5,
                    buttons: buttons,
                    inputEnabled: false,
                    selected: 3
                },
                xAxis: {
                    events: {
                        setExtremes: function (event) {
                            var minValue = event.min;
                            var maxValue = event.max;
                            that._chart.characteristicUpdater(minValue, maxValue);
                        }
                    }
                },
                yAxis: {
                    title: {
                        text: 'Amplitude'
                    }
                },
                tooltip: {
                    pointFormatter: function () {
                        return that.formatPoint(this);
                    }
                },
                title: {
                    text: that._chartData.fileName
                },
                series: [
                    {
                        name: "Signal",
                        data: that._chartData.points
                    }
                ]
            };
            return result;
        };
        ChartConfigurationBuilder.prototype.generateButtons = function () {
            var initPointNumber = 64;
            var exp = 6;
            var buttons = new Array();
            for (var i = initPointNumber; i < this._chartData.points.length; i *= 2) {
                buttons.push({ type: "second", count: i, text: "2^" + exp.toString() });
                exp++;
            }
            return buttons;
        };
        return ChartConfigurationBuilder;
    })(Dsp.ChartConfigurationBuilderBase);
    var SignalMetadata = (function () {
        function SignalMetadata(jsonData) {
            this._totalReceiveTime = jsonData.TotalReceiveTime;
            this._dataSize = jsonData.DataSize;
            this._frequencyDefinition = jsonData.FrequencyDefinition;
        }
        Object.defineProperty(SignalMetadata.prototype, "totalReceiveTime", {
            get: function () {
                return this._totalReceiveTime;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SignalMetadata.prototype, "dataSize", {
            get: function () {
                return this._dataSize;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SignalMetadata.prototype, "frequencyDefinition", {
            get: function () {
                return this._frequencyDefinition;
            },
            enumerable: true,
            configurable: true
        });
        return SignalMetadata;
    })();
    Dsp.SignalMetadata = SignalMetadata;
})(Dsp || (Dsp = {}));
//# sourceMappingURL=dsp-chart.js.map