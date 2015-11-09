// <reference path="../typings/highcharts/highstock.d.ts"
var Dsp;
(function (Dsp) {
    var Chart = (function () {
        function Chart(containerId, seriesId, jsonData) {
            this._containerId = containerId;
            this._chartData = new ChartData(seriesId, jsonData);
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
            var chartBuilder = new ChartConfigurationBuilder(this._chartData, this);
            $('#' + this._containerId).highcharts("StockChart", chartBuilder.createConfiguration());
        };
        Chart.prototype.characteristicUpdater = function (startPoint, endPoint) {
            var characteristicResult = this._characteristicCalculator.calculate(startPoint, endPoint);
            this.setupCharecteristics(characteristicResult);
        };
        Chart.prototype.setupCharecteristics = function (characteristicsResult) {
            this._chartData.characteristics.maxValue = characteristicsResult.maxValue;
            this._chartData.characteristics.minValue = characteristicsResult.minValue;
            this._chartData.characteristics.peakFactor = characteristicsResult.peakFactor;
            this._chartData.characteristics.peekToPeek = characteristicsResult.peekToPeek;
            this._chartData.characteristics.standardDeviation = characteristicsResult.standardDeviation;
        };
        return Chart;
    })();
    Dsp.Chart = Chart;
    var ChartData = (function () {
        function ChartData(seriesId, jsonObject) {
            this._fileName = jsonObject.FileName;
            this._characteristics = new Dsp.Characteristics(seriesId, jsonObject.Characteristics);
            this._signalMetadata = new SignalMetadata(jsonObject.SignalMetadata);
            this._data = new Array();
            this._dataPointMap = {};
            this.initializeData(jsonObject);
        }
        ChartData.prototype.initializeData = function (jsonData) {
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
        Object.defineProperty(ChartData.prototype, "fileName", {
            get: function () {
                return this._fileName;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ChartData.prototype, "characteristics", {
            get: function () {
                return this._characteristics;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ChartData.prototype, "data", {
            get: function () {
                return this._data.map(function (point) {
                    var pointValues = new Array();
                    pointValues.push(point.time, point.amplitude);
                    return pointValues;
                });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ChartData.prototype, "dataPoints", {
            get: function () {
                return this._data;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ChartData.prototype, "dataMap", {
            get: function () {
                return this._dataPointMap;
            },
            enumerable: true,
            configurable: true
        });
        return ChartData;
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
                    zoomType: "x",
                    events: {
                        selection: function (event) {
                            if (event.xAxis) {
                                var minValue = event.xAxis[0].min;
                                var maxValue = event.xAxis[0].max;
                                that._chart.characteristicUpdater(minValue, maxValue);
                            }
                        }
                    }
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