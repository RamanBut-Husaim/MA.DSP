module Dsp {
    export class DoubleIntegralSpectrumChartBuilder implements IWindowBasedChartBuilder {

        public create(chartData: WindowChartData): WindowChart {
            var dataProvider = new SpectrumDataProvider(chartData.signalMetadata, chartData.points);

            var chartInfo: ChartInfo = new ChartInfo();
            chartInfo.seriesName = "Values";
            chartInfo.title = "Double Integral Spectrum";
            chartInfo.yAxisTitle = "Amplitude";
            chartInfo.chartType = "column";

            var configurationBuilder = new WindowChartConfigurationBuilder(chartInfo, dataProvider);

            return new WindowChart(chartData, configurationBuilder);
        }
    }
}