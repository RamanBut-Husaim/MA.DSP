// <reference path="../typings/highcharts/highstock.d.ts"
// <reference path="../typings/highcharts/highcharts.d.ts"

module Dsp {
    export class ChartData {
        containerId: string;
        seriesId: string;
        fileName: string;
        signalMetadata: SignalMetadata;
        characteristics: any;
        points: any;
        chartManager: ChartManager;
    }

    export class Chart extends ChartBase {
        private _containerId: string;
        private _chartManager: ChartManager;
        private _chartData: ChartDataProvider;
        private _characteristicCalculator: CharacteristicCalculator;
        private _chartBuilder: ChartConfigurationBuilder;

        private _characteristicResult: ICharacteristicResult;

        constructor(chartData: ChartData) {
            super();
            this._containerId = chartData.containerId;
            this._chartManager = chartData.chartManager;
            this._chartData = new ChartDataProvider(chartData);
            this._characteristicCalculator = new CharacteristicCalculator(this._chartData.dataPoints);
        }

        get containerId(): string {
            return this._containerId;
        }

        public draw(): void {
            const that = this;
            this._chartBuilder =  new ChartConfigurationBuilder(this._chartData, this);
            $('#' + this._containerId).highcharts("StockChart", this._chartBuilder.createConfiguration());
        }

        public characteristicUpdater(startPoint: number, endPoint: number): void {
            this._characteristicResult = this._characteristicCalculator.calculate(startPoint, endPoint);
            this.setupCharecteristics();

            var windowPoints: DataPoint[] = this.getWindowsPoints();
            this._chartManager.redrawWindowCharts(windowPoints);
        }

        private setupCharecteristics(): void {
            this._chartData.characteristics.maxValue = this._characteristicResult.maxValue;
            this._chartData.characteristics.minValue = this._characteristicResult.minValue;
            this._chartData.characteristics.peakFactor = this._characteristicResult.peakFactor;
            this._chartData.characteristics.peekToPeek = this._characteristicResult.peekToPeek;
            this._chartData.characteristics.standardDeviation = this._characteristicResult.standardDeviation;
        }

        private getWindowsPoints(): Array<DataPoint> {

            if (!this._characteristicResult) {
                return new Array<DataPoint>();
            }

            var points: Array<DataPoint> = new Array<DataPoint>();

            var endIndex: number = this._characteristicResult.window.startIndex + this._characteristicResult.window.size;
            for (var i = this._characteristicResult.window.startIndex; i < endIndex; ++i) {
                points.push(this._chartData.dataPoints[i]);
            }

            return points;
        }
    }

    class ChartDataProvider extends ChartDataProviderBase {
        private _fileName: string;
        private _characteristics: Characteristics;
        private _signalMetadata: SignalMetadata;
        private _data: Array<DataPoint>;
        private _dataPointMap: IDataPointMap;

        constructor(chartData: ChartData) {
            super();
            this._fileName = chartData.fileName;
            this._characteristics = new Characteristics(chartData.seriesId, chartData.characteristics);
            this._signalMetadata = chartData.signalMetadata;
            this._data = new Array<DataPoint>();
            this._dataPointMap = {};
            this.initializeData(chartData.points);
        }

        private initializeData(points): void {
            var time: number = (new Date()).getTime();
            var frequency: number = 0;
            var frequencyStep: number = this._signalMetadata.totalReceiveTime / this._signalMetadata.dataSize;
            var timeStep: number = 1000;

            const that = this;
            $.each(points, (index, element) => {
                var point = new DataPoint(frequency, time, element.Y);
                that._data.push(point);
                that._dataPointMap[time.toString()] = point;
                frequency += frequencyStep;
                time += timeStep;
            });
        }

        get fileName(): string {
            return this._fileName;
        }

        get characteristics(): Characteristics {
            return this._characteristics;
        }

        get dataPoints(): Array<DataPoint> {
            return this._data;
        }

        get dataMap(): IDataPointMap {
            return this._dataPointMap;
        }

        get signalMetadata(): SignalMetadata {
            return this._signalMetadata;
        }
    }

    class ChartConfigurationBuilder extends ChartConfigurationBuilderBase {
        private _chartData: ChartDataProvider;
        private _chart : Chart;

        constructor(chartData: ChartDataProvider, chart: Chart) {
            super();
            this._chartData = chartData;
            this._chart = chart;
        }

        public get chartDataProvider(): ChartDataProviderBase {
            return this._chartData;
        }

        public createConfiguration(): HighstockOptions {
            const that = this;
            var buttons: Array<IButton> = this.generateButtons();
            var result = {
                chart: {
                    zoomType: "x"
                },
                rangeSelector: {
                    buttonSpacing: 5,
                    buttons: buttons,
                    inputEnabled: false,
                    selected: 3
                },
                xAxis: {
                    events: {
                        setExtremes(event) {
                            var minValue: number = event.min;
                            var maxValue: number = event.max;
                            that._chart.characteristicUpdater(minValue, maxValue);
                        }
                    }
                },
                yAxis: {
                    title: {
                        text: 'Amplitude'
                    }
                },
                tooltip: {
                    pointFormatter() {
                        return that.formatPoint(this);
                    }
                },
                title: {
                    text: that._chartData.fileName
                },
                series: [
                    {
                        name: "Signal",
                        data: that._chartData.points
                    }
                ]
            };

            return result;
        }

        private generateButtons() : Array<IButton> {
            var initPointNumber: number = 64;
            var exp: number = 6;
            var buttons: Array<IButton> = new Array<IButton>();
            for (var i = initPointNumber; i < this._chartData.points.length; i *= 2) {

                buttons.push({ type: "second", count: i, text: `2^${exp.toString()}` });
                exp++;
            }

            return buttons;
        }
    }

    interface IButton {
        type: string;
        count: number;
        text: string;
    }
}