module Dsp {

    export class WindowChartData {
        containerId: string;
        points: Array<DataPoint>;
        signalMetadata: SignalMetadata;
    }

    export class WindowChart extends ChartBase {
        private _containerId: string;
        private _chartConfigurationBuilder: WindowChartConfigurationBuilder;

        public get containerId(): string {
            return this._containerId;
        }

        constructor(chartData: WindowChartData, chartConfigurationBuilder: WindowChartConfigurationBuilder) {
            super();
            this._containerId = chartData.containerId;
            this._chartConfigurationBuilder = chartConfigurationBuilder;
        }

        public draw(): void {
            $('#' + this._containerId).highcharts(this._chartConfigurationBuilder.createConfiguration());
        }
    }

    export class ChartInfo {
        title: string;
        yAxisTitle: string;
        seriesName: string;
        chartType: string;
    }

    export class WindowChartConfigurationBuilder extends ChartConfigurationBuilderBase {
        private _dataProvider: ChartDataProviderBase;
        private _chartInfo: ChartInfo;

        constructor(chartInfo: ChartInfo, dataProvider: ChartDataProviderBase) {
            super();
            this._dataProvider = dataProvider;
            this._chartInfo = chartInfo;
        }

        public get chartDataProvider(): ChartDataProviderBase {
            return this._dataProvider;
        }

        public createConfiguration(): HighchartsOptions {
            const that = this;

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
                    pointFormatter() {
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
        }
    }
}