var Dsp;
(function (Dsp) {
    var ChartBase = (function () {
        function ChartBase() {
        }
        ChartBase.prototype.destroy = function () {
            var that = this;
            $.each(Highcharts.charts, function (index, chart) {
                var anyChart = chart;
                if (anyChart && $(anyChart.renderTo).attr("id") === that.containerId) {
                    anyChart.destroy();
                    return false;
                }
            });
        };
        return ChartBase;
    })();
    Dsp.ChartBase = ChartBase;
    var ChartDataProviderBase = (function () {
        function ChartDataProviderBase() {
        }
        Object.defineProperty(ChartDataProviderBase.prototype, "points", {
            get: function () {
                return this.dataPoints.map(function (point) {
                    var pointValues = new Array();
                    pointValues.push(point.xValue, point.amplitude);
                    return pointValues;
                });
            },
            enumerable: true,
            configurable: true
        });
        return ChartDataProviderBase;
    })();
    Dsp.ChartDataProviderBase = ChartDataProviderBase;
    var ChartConfigurationBuilderBase = (function () {
        function ChartConfigurationBuilderBase() {
        }
        ChartConfigurationBuilderBase.prototype.formatPoint = function (point) {
            var resultFormat = "<span style=\"color:" + point.color + "\">\u25CF</span>" + point.series.name;
            var dataPoint = this.chartDataProvider.dataMap[point.x.toString()];
            if (dataPoint) {
                resultFormat += ": <b>(" + dataPoint.frequency.toString() + ";" + point.y.toString() + ")</b><br/>";
            }
            else {
                resultFormat += ": <b>" + point.y.toString() + "</b><br/>";
            }
            return resultFormat;
        };
        return ChartConfigurationBuilderBase;
    })();
    Dsp.ChartConfigurationBuilderBase = ChartConfigurationBuilderBase;
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
//# sourceMappingURL=dsp-chart-core.js.map