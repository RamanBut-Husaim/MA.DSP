var Dsp;
(function (Dsp) {
    var SpectrumChartData = (function () {
        function SpectrumChartData() {
        }
        return SpectrumChartData;
    })();
    Dsp.SpectrumChartData = SpectrumChartData;
    var SpectrumChart = (function () {
        function SpectrumChart(chartData) {
            this._containerId = chartData.containerId;
            this._sampleRate = chartData.sampleRate;
            this._pointNumber = chartData.points.length;
            this._points = chartData.points;
            this._dataProvider = new SpectrumDataProvider(this._points, this._sampleRate);
            this._chartConfigurationBuilder = new SpectrumChartConfiguraitonBuilder(this, this._dataProvider);
        }
        SpectrumChart.prototype.draw = function () {
            $('#' + this._containerId).highcharts(this._chartConfigurationBuilder.createConfiguration());
        };
        SpectrumChart.prototype.destroy = function () {
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
        return SpectrumChart;
    })();
    Dsp.SpectrumChart = SpectrumChart;
    var SpectrumDataProvider = (function () {
        function SpectrumDataProvider(points, sampleRate) {
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
        Object.defineProperty(SpectrumDataProvider.prototype, "points", {
            get: function () {
                return this._dataPoints.map(function (point) {
                    var pointValues = new Array();
                    pointValues.push(point.xValue, point.amplitude);
                    return pointValues;
                });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SpectrumDataProvider.prototype, "pointMap", {
            get: function () {
                return this._dataPointMap;
            },
            enumerable: true,
            configurable: true
        });
        return SpectrumDataProvider;
    })();
    var SpectrumChartConfiguraitonBuilder = (function () {
        function SpectrumChartConfiguraitonBuilder(chart, dataProvider) {
            this._chart = chart;
            this._dataProvider = dataProvider;
        }
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
        SpectrumChartConfiguraitonBuilder.prototype.formatPoint = function (point) {
            var resultFormat = '<span style="color:' + point.color + '">\u25CF</span>'
                + point.series.name;
            var dataPoint = this._dataProvider.pointMap[point.x.toString()];
            if (dataPoint) {
                resultFormat += ': <b>(' + dataPoint.frequency.toString() + ';' + point.y.toString() + ')</b><br/>';
            }
            else {
                resultFormat += ': <b>' + point.y.toString() + '</b><br/>';
            }
            return resultFormat;
        };
        return SpectrumChartConfiguraitonBuilder;
    })();
})(Dsp || (Dsp = {}));
//# sourceMappingURL=dsp-chart-spectrum.js.map