var Dsp;
(function (Dsp) {
    var ChartBase = (function () {
        function ChartBase() {
        }
        ChartBase.prototype.destroy = function () {
            var that = this;
            $.each(Highcharts.charts, function (index, chart) {
                var anyChart = chart;
                if ($(anyChart.renderTo).attr("id") === that.containerId) {
                    anyChart.destroy();
                    Highcharts.charts.splice(index, 1);
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
})(Dsp || (Dsp = {}));
//# sourceMappingURL=dsp-chart-core.js.map