﻿module Dsp {
    export class ChartManager {
        private _containerId: string;
        private _seriesId: string;

        private _spectrumChartBuilder: SpectrumChartBuilder;
        private _integralChartBuilder: IntegralChartBuilder;
        private _integralSpectrumChartBuilder: IntegralSpectrumChartBuilder;
        private _doubleIntegralChartBuilder: DoubleIntegralChartBuilder;
        private _doubleIntegralSpectrumChartBuilder: DoubleIntegralChartBuilder;

        private _mainChart: Chart;
        private _spectrumChart: WindowChart;
        private _integralChart: WindowChart;
        private _integralSpectrumChart: WindowChart;
        private _doubleIntegralChart: WindowChart;
        private _doubleIntegralSpectrumChart: WindowChart;

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
            this._doubleIntegralChartBuilder = new DoubleIntegralChartBuilder();
            this._doubleIntegralSpectrumChartBuilder = new DoubleIntegralSpectrumChartBuilder();
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
            this._doubleIntegralChart = this.createDoubleIntegralChart(points);
            this._doubleIntegralSpectrumChart = this.createDoubleIntegralSpectrumChart(this._doubleIntegralChart.chartConfigurationBuilder.chartDataProvider.dataPoints);

            $.each(this.windowCharts, (index, chart) => {
                chart.draw();
            });
        }

        private get windowCharts(): WindowChart[] {
            return [
                this._spectrumChart,
                this._integralChart,
                this._integralSpectrumChart,
                this._doubleIntegralChart,
                this._doubleIntegralSpectrumChart
            ];
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

        private createDoubleIntegralChart(points: DataPoint[]): WindowChart {
            return this._doubleIntegralChartBuilder.create({
                containerId: this._containerId + "_double_integral",
                points: points,
                signalMetadata: this._signalMetadata
            });
        }

        private createDoubleIntegralSpectrumChart(points: DataPoint[]): WindowChart {
            return this._doubleIntegralSpectrumChartBuilder.create({
                containerId: this._containerId + "_double_integral_spectrum",
                points: points,
                signalMetadata: this._signalMetadata
            });
        }

        private cleanUpCharts() {
            $.each(this.windowCharts, (index, chart) => {
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