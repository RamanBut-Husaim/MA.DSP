module Dsp {
    export class ChartManager {
        private _containerId: string;
        private _seriesId: string;

        private _spectrumChartBuilder: SpectrumChartBuilder;
        private _integralChartBuilder: IntegralChartBuilder;
        private _integralSpectrumChartBuilder: IntegralSpectrumChartBuilder;

        private _mainChart: Chart;
        private _spectrumChart: WindowChart;
        private _integralChart: WindowChart;
        private _integralSpectrumChart: WindowChart;

        private _signalMetadata: SignalMetadata;

        constructor(containerId: string, seriesId: string, jsonData: any) {
            this._containerId = containerId;
            this._seriesId = seriesId;
            this._signalMetadata = new SignalMetadata(jsonData.SignalMetadata);
            this.createMainChart(jsonData);
            this.createChartBuilders();
        }

        private createChartBuilders(): void {
            this._spectrumChartBuilder = new SpectrumChartBuilder();
            this._integralChartBuilder = new IntegralChartBuilder();
            this._integralSpectrumChartBuilder = new IntegralSpectrumChartBuilder();
        }

        private createMainChart(jsonData: any): void {
            this._mainChart = new Chart({
                containerId: this._containerId,
                seriesId: this._seriesId,
                fileName: jsonData.FileName,
                signalMetadata: this._signalMetadata,
                characteristics: jsonData.Characteristics,
                points: jsonData.Points,
                chartManager: this
            });
        }

        public drawCharts(): void {
            this._mainChart.draw();
        }

        public destroyCharts(): void {
            this.cleanUpCharts();
            this._mainChart.destroy();
        }

        public redrawWindowCharts(points: DataPoint[]): void {
            this.cleanUpCharts();

            this._spectrumChart = this.createSpectrumChart(points);
            this._integralChart = this.createIntegralChart(points);
            this._integralSpectrumChart = this.createIntegramSpectrumChart(this._integralChart.chartConfigurationBuilder.chartDataProvider.dataPoints);

            var chartsToDraw: WindowChart[] = [
                this._spectrumChart,
                this._integralChart,
                this._integralSpectrumChart];

            $.each(chartsToDraw, (index, chart) => {
                chart.draw();
            });
        }

        private createSpectrumChart(points: DataPoint[]): WindowChart {
            return this._spectrumChartBuilder.create({
                containerId: this._containerId + "_spectrum",
                points: points,
                signalMetadata: this._signalMetadata
            });
        }

        private createIntegralChart(points: DataPoint[]): WindowChart {
            return this._integralChartBuilder.create({
                containerId: this._containerId + "_integral",
                points: points,
                signalMetadata: this._signalMetadata
            });
        }

        private createIntegramSpectrumChart(points: DataPoint[]): WindowChart {
            return this._integralSpectrumChartBuilder.create({
                containerId: this._containerId + "_integral_spectrum",
                points: points,
                signalMetadata: this._signalMetadata
            });
        }

        private cleanUpCharts() {
            var chartsToDestroy: WindowChart[] = [
                this._spectrumChart,
                this._integralChart,
                this._integralSpectrumChart];

            $.each(chartsToDestroy, (index, chart) => {
                if (chart) {
                    chart.destroy();
                }
            });

            var validCharts: Array<HighchartsChart> = new Array<HighchartsChart>();
            $.each(Highcharts.charts, (index, chart) => {
                if (chart != undefined) {
                    validCharts.push(chart);
                }
            });

            Highcharts.charts.length = 0;
            validCharts.forEach((chart) => Highcharts.charts.push(chart));
        }
    }
}