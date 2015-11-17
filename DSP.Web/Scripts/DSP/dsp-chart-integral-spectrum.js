var Dsp;
(function (Dsp) {
    var IntegralSpectrumChartBuilder = (function () {
        function IntegralSpectrumChartBuilder() {
        }
        IntegralSpectrumChartBuilder.prototype.create = function (chartData) {
            var dataProvider = new Dsp.SpectrumDataProvider(chartData.signalMetadata, chartData.points);
            var chartInfo = new Dsp.ChartInfo();
            chartInfo.seriesName = "Values";
            chartInfo.title = "Integral Spectrum";
            chartInfo.yAxisTitle = "Amplitude";
            chartInfo.chartType = "column";
            var configurationBuilder = new Dsp.WindowChartConfigurationBuilder(chartInfo, dataProvider);
            return new Dsp.WindowChart(chartData, configurationBuilder);
        };
        return IntegralSpectrumChartBuilder;
    })();
    Dsp.IntegralSpectrumChartBuilder = IntegralSpectrumChartBuilder;
})(Dsp || (Dsp = {}));
//# sourceMappingURL=dsp-chart-integral-spectrum.js.map