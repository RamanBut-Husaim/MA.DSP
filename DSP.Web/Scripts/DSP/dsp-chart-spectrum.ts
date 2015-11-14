module Dsp {

    export class SpectrumChartData {
        containerId: string;
        points: Array<number>;
        sampleRate: number;
    }

    export class SpectrumChart extends ChartBase {
        private _containerId: string;
        private _sampleRate: number;
        private _pointNumber: number;
        private _points: Array<number>;
        private _dataProvider: SpectrumDataProvider;
        private _chartConfigurationBuilder: SpectrumChartConfiguraitonBuilder;

        public get containerId(): string {
            return this._containerId;
        }

        constructor(chartData: SpectrumChartData) {
            super();
            this._containerId = chartData.containerId;
            this._sampleRate = chartData.sampleRate;
            this._pointNumber = chartData.points.length;
            this._points = chartData.points;
            this._dataProvider = new SpectrumDataProvider(this._points, this._sampleRate);
            this._chartConfigurationBuilder = new SpectrumChartConfiguraitonBuilder(this, this._dataProvider);
        }

        public draw(): void {
            $('#' + this._containerId).highcharts(this._chartConfigurationBuilder.createConfiguration());
        }
    }

    class SpectrumDataProvider extends ChartDataProviderBase {
        private _fftBuilder: FFTBuilder;
        private _points: Array<number>;
        private _sampleRate: number;
        private _dataPointMap: IDataPointMap;
        private _dataPoints: Array<DataPoint>;

        constructor(points: Array<number>, sampleRate: number) {
            super();
            this._points = points;
            this._sampleRate = sampleRate;
            this._fftBuilder = new FFTBuilder();
            this._dataPointMap = {};
            this.initialize();
        }


        private initialize(): void {
            var fft = this._fftBuilder.create(this._points.length, this._sampleRate);
            fft.forward(this._points);

            this._dataPoints = new Array<DataPoint>();
            for (var i = 0; i < fft.spectrum.length; ++i) {
                var dataPoint = new DataPoint(i * 1 / this._sampleRate, i, fft.spectrum[i]);
                this._dataPoints.push(dataPoint);
                this._dataPointMap[i.toString()] = dataPoint;
            }
        }

        public get dataPoints(): Array<DataPoint> {
            return this._dataPoints;
        }

        public get dataMap(): IDataPointMap {
            return this._dataPointMap;
        }
    }

    class SpectrumChartConfiguraitonBuilder extends ChartConfigurationBuilderBase {
        private _chart: SpectrumChart;
        private _dataProvider: SpectrumDataProvider;

        constructor(chart: SpectrumChart, dataProvider: SpectrumDataProvider) {
            super();
            this._chart = chart;
            this._dataProvider = dataProvider;
        }

        public get chartDataProvider(): ChartDataProviderBase {
            return this._dataProvider;
        }

        public createConfiguration(): HighchartsOptions {
            const that = this;

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
                    pointFormatter() {
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
        }
    }
}