var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Dsp;
(function (Dsp) {
    var WindowChartData = (function () {
        function WindowChartData() {
        }
        return WindowChartData;
    })();
    Dsp.WindowChartData = WindowChartData;
    var WindowChart = (function (_super) {
        __extends(WindowChart, _super);
        function WindowChart(chartData, chartConfigurationBuilder) {
            _super.call(this);
            this._containerId = chartData.containerId;
            this._chartConfigurationBuilder = chartConfigurationBuilder;
        }
        Object.defineProperty(WindowChart.prototype, "containerId", {
            get: function () {
                return this._containerId;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(WindowChart.prototype, "chartConfigurationBuilder", {
            get: function () {
                return this._chartConfigurationBuilder;
            },
            enumerable: true,
            configurable: true
        });
        WindowChart.prototype.draw = function () {
            $('#' + this._containerId).highcharts(this._chartConfigurationBuilder.createConfiguration());
        };
        return WindowChart;
    })(Dsp.ChartBase);
    Dsp.WindowChart = WindowChart;
    var ChartInfo = (function () {
        function ChartInfo() {
        }
        return ChartInfo;
    })();
    Dsp.ChartInfo = ChartInfo;
    var WindowChartConfigurationBuilder = (function (_super) {
        __extends(WindowChartConfigurationBuilder, _super);
        function WindowChartConfigurationBuilder(chartInfo, dataProvider) {
            _super.call(this);
            this._dataProvider = dataProvider;
            this._chartInfo = chartInfo;
        }
        Object.defineProperty(WindowChartConfigurationBuilder.prototype, "chartDataProvider", {
            get: function () {
                return this._dataProvider;
            },
            enumerable: true,
            configurable: true
        });
        WindowChartConfigurationBuilder.prototype.createConfiguration = function () {
            var that = this;
            var result = {
                chart: {
                    zoomType: "x",
                    type: that._chartInfo.chartType
                },
                title: {
                    text: that._chartInfo.title
                },
                yAxis: {
                    title: {
                        text: that._chartInfo.yAxisTitle
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
                        name: that._chartInfo.seriesName,
                        data: that._dataProvider.points
                    }
                ]
            };
            return result;
        };
        return WindowChartConfigurationBuilder;
    })(Dsp.ChartConfigurationBuilderBase);
    Dsp.WindowChartConfigurationBuilder = WindowChartConfigurationBuilder;
})(Dsp || (Dsp = {}));
//# sourceMappingURL=dsp-window-chart.js.map