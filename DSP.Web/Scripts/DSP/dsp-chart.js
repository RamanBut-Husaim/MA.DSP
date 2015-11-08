// <reference path="../typings/highcharts/highcharts.d.ts"
var Dsp;
(function (Dsp) {
    var Chart = (function () {
        function Chart(containerId, jsonData) {
            this._containerId = containerId;
            this._chartData = new ChartData(jsonData);
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
            $('#' + this._containerId).highcharts({
                chart: {
                    zoomType: 'x'
                },
                title: {
                    text: that._chartData.fileName
                },
                xAxis: {
                    type: 'line'
                },
                yAxis: {
                    title: {
                        text: 'Amplitude'
                    }
                },
                legend: {
                    enabled: false
                },
                series: [
                    {
                        type: 'line',
                        name: 'Signal',
                        data: this._chartData.data
                    }
                ]
            });
        };
        return Chart;
    })();
    Dsp.Chart = Chart;
    var ChartData = (function () {
        function ChartData(jsonObject) {
            this._fileName = jsonObject.FileName;
            this._characteristics = new Characteristics(jsonObject.Characteristics);
            this._signalMetadata = new SignalMetadata(jsonObject.SignalMetadata);
            this._data = new Array();
            this.initializeData(jsonObject);
        }
        ChartData.prototype.initializeData = function (jsonData) {
            var _this = this;
            var frequency = 0;
            var step = this._signalMetadata.totalReceiveTime / this._signalMetadata.dataSize;
            $.each(jsonData.Points, function (index, element) {
                var point = new Array();
                point.push(frequency, element.Y);
                frequency += step;
                _this._data.push(point);
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
                return this._data;
            },
            enumerable: true,
            configurable: true
        });
        return ChartData;
    })();
    var Characteristics = (function () {
        function Characteristics(jsonObject) {
            this._maxValue = jsonObject.MaxValue;
            this._minValue = jsonObject.MinValue;
            this._peakFactor = jsonObject.PeakFactor;
            this._peekToPeek = jsonObject.PeekToPeek;
            this._standardDeviation = jsonObject.StandardDeviation;
        }
        Object.defineProperty(Characteristics.prototype, "maxValue", {
            get: function () {
                return this._maxValue;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Characteristics.prototype, "minValue", {
            get: function () {
                return this._minValue;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Characteristics.prototype, "peakFactor", {
            get: function () {
                return this._peakFactor;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Characteristics.prototype, "peekToPeek", {
            get: function () {
                return this._peekToPeek;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Characteristics.prototype, "standardDeviation", {
            get: function () {
                return this._standardDeviation;
            },
            enumerable: true,
            configurable: true
        });
        return Characteristics;
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