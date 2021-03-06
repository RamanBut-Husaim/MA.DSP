var Dsp;
(function (Dsp) {
    var SpectrumChartBuilder = (function () {
        function SpectrumChartBuilder() {
        }
        SpectrumChartBuilder.prototype.create = function (chartData) {
            var dataProvider = new Dsp.SpectrumDataProvider(chartData.signalMetadata, chartData.points);
            var chartInfo = new Dsp.ChartInfo();
            chartInfo.seriesName = "Values";
            chartInfo.title = "Spectrum";
            chartInfo.yAxisTitle = "Amplitude";
            chartInfo.chartType = "column";
            var configurationBuilder = new Dsp.WindowChartConfigurationBuilder(chartInfo, dataProvider);
            return new Dsp.WindowChart(chartData, configurationBuilder);
        };
        return SpectrumChartBuilder;
    })();
    Dsp.SpectrumChartBuilder = SpectrumChartBuilder;
})(Dsp || (Dsp = {}));
//# sourceMappingURL=dsp-chart-spectrum.js.map