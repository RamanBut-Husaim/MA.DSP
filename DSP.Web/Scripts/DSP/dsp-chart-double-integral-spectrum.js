var Dsp;
(function (Dsp) {
    var DoubleIntegralSpectrumChartBuilder = (function () {
        function DoubleIntegralSpectrumChartBuilder() {
        }
        DoubleIntegralSpectrumChartBuilder.prototype.create = function (chartData) {
            var dataProvider = new Dsp.SpectrumDataProvider(chartData.signalMetadata, chartData.points);
            var chartInfo = new Dsp.ChartInfo();
            chartInfo.seriesName = "Values";
            chartInfo.title = "Double Integral Spectrum";
            chartInfo.yAxisTitle = "Amplitude";
            chartInfo.chartType = "column";
            var configurationBuilder = new Dsp.WindowChartConfigurationBuilder(chartInfo, dataProvider);
            return new Dsp.WindowChart(chartData, configurationBuilder);
        };
        return DoubleIntegralSpectrumChartBuilder;
    })();
    Dsp.DoubleIntegralSpectrumChartBuilder = DoubleIntegralSpectrumChartBuilder;
})(Dsp || (Dsp = {}));
//# sourceMappingURL=dsp-chart-double-integral-spectrum.js.map