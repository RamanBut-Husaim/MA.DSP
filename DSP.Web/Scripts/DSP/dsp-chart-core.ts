module Dsp {
    export interface IChart {
        containerId: string;

        draw(): void;

        destroy(): void;
    }

    export abstract class ChartBase implements IChart {
        public abstract draw(): void;

        destroy(): void {
            const that = this;
            $.each(Highcharts.charts, (index, chart) => {
                var anyChart: any = chart;

                if (anyChart && $(anyChart.renderTo).attr("id") === that.containerId) {
                    anyChart.destroy();
                    return false;
                }
            });
        }

        containerId: string;
    }

    export abstract class ChartDataProviderBase {

        public dataPoints: Array<DataPoint>;

        public get points(): Array<Array<number>> {
            return this.dataPoints.map((point) => {
                var pointValues = new Array<number>();
                pointValues.push(point.xValue, point.amplitude);
                return pointValues;
            });
        }

        public dataMap: IDataPointMap;
    }

    export abstract class ChartConfigurationBuilderBase {
        chartDataProvider: ChartDataProviderBase;

        public abstract createConfiguration(): HighchartsOptions;

        protected formatPoint(point: any): string {
            var resultFormat = `<span style="color:${point.color}">\u25CF</span>${point.series.name}`;

            var dataPoint = this.chartDataProvider.dataMap[point.x.toString()];

            if (dataPoint) {
                resultFormat += `: <b>(${dataPoint.frequency.toString()};${point.y.toString()})</b><br/>`;
            } else {
                resultFormat += `: <b>${point.y.toString()}</b><br/>`;
            }

            return resultFormat;
        }
    }
}