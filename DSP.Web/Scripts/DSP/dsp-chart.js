// <reference path="../typings/highcharts/highstock.d.ts"
// <reference path="../typings/highcharts/highcharts.d.ts"
var Dsp;
(function (Dsp) {
    var Chart = (function () {
        function Chart(containerId, seriesId, jsonData) {
            this._containerId = containerId;
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
        Chart.prototype.destroy = function () {
            var that = this;
            $.each(Highcharts.charts, function (index, chart) {
                var anyChart = chart;
                if ($(anyChart.renderTo).attr("id") === that._containerId) {
                    anyChart.destroy();
                    Highcharts.charts.splice(index, 1);
                    return false;
                }
            });
        };
        Chart.prototype.characteristicUpdater = function (startPoint, endPoint) {
            this._characteristicResult = this._characteristicCalculator.calculate(startPoint, endPoint);
            this.setupCharecteristics();
            if (this._spectrumChart) {
                this._spectrumChart.destroy();
            }
            this._spectrumChart = new Dsp.SpectrumChart({
                containerId: this._containerId + "_spectrum",
                sampleRate: this._chartData.sampleRate,
                points: this.getSpectrumPoints()
            });
            this._spectrumChart.draw();
        };
        Chart.prototype.setupCharecteristics = function () {
            this._chartData.characteristics.maxValue = this._characteristicResult.maxValue;
            this._chartData.characteristics.minValue = this._characteristicResult.minValue;
            this._chartData.characteristics.peakFactor = this._characteristicResult.peakFactor;
            this._chartData.characteristics.peekToPeek = this._characteristicResult.peekToPeek;
            this._chartData.characteristics.standardDeviation = this._characteristicResult.standardDeviation;
        };
        Chart.prototype.getSpectrumPoints = function () {
            if (!this._characteristicResult) {
                return new Array();
            }
            var points = new Array();
            var endIndex = this._characteristicResult.window.startIndex + this._characteristicResult.window.size;
            for (var i = this._characteristicResult.window.startIndex; i < endIndex; ++i) {
                points.push(this._chartData.dataPoints[i].amplitude);
            }
            return points;
        };
        return Chart;
    })();
    Dsp.Chart = Chart;
    var ChartDataProvider = (function () {
        function ChartDataProvider(seriesId, jsonObject) {
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
        Object.defineProperty(ChartDataProvider.prototype, "data", {
            get: function () {
                return this._data.map(function (point) {
                    var pointValues = new Array();
                    pointValues.push(point.xValue, point.amplitude);
                    return pointValues;
                });
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
        Object.defineProperty(ChartDataProvider.prototype, "sampleRate", {
            get: function () {
                return this._sampleRate;
            },
            enumerable: true,
            configurable: true
        });
        return ChartDataProvider;
    })();
    var ChartConfigurationBuilder = (function () {
        function ChartConfigurationBuilder(chartData, chart) {
            this._chartData = chartData;
            this._chart = chart;
        }
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
                    inputDateFormat: "%H:%M:%S.%L",
                    inputEditDateFormat: '%H:%M:%S.%L',
                    inputDateParser: function (value) {
                        var values = value.split(/[:\.]/);
                        return Date.UTC(1970, 0, 1, parseInt(values[0], 10), parseInt(values[1], 10), parseInt(values[2], 10), parseInt(values[3], 10));
                    },
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
                        data: that._chartData.data
                    }
                ]
            };
            return result;
        };
        ChartConfigurationBuilder.prototype.formatPoint = function (point) {
            var resultFormat = '<span style="color:' + point.color + '">\u25CF</span>'
                + point.series.name;
            var dataPoint = this._chartData.dataMap[point.x.toString()];
            if (dataPoint) {
                resultFormat += ': <b>(' + dataPoint.frequency.toString() + ';' + point.y.toString() + ')</b><br/>';
            }
            else {
                resultFormat += ': <b>' + point.y.toString() + '</b><br/>';
            }
            return resultFormat;
        };
        ChartConfigurationBuilder.prototype.generateButtons = function () {
            var initPointNumber = 64;
            var exp = 6;
            var buttons = new Array();
            for (var i = initPointNumber; i < this._chartData.data.length; i *= 2) {
                buttons.push({ type: "second", count: i, text: "2^" + exp.toString() });
                exp++;
            }
            return buttons;
        };
        return ChartConfigurationBuilder;
    })();
    var SignalMetadata = (function () {
        function SignalMetadata(jsonData) {
            this._totalReceiveTime = jsonData.TotalReceiveTime;
            this._dataSize = jsonData.DataSize;
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
        return SignalMetadata;
    })();
})(Dsp || (Dsp = {}));
//# sourceMappingURL=dsp-chart.js.map