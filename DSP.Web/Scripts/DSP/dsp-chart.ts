// <reference path="../typings/highcharts/highstock.d.ts"
// <reference path="../typings/highcharts/highcharts.d.ts"

module Dsp {
    // all this stuff should be refactored. Became a mess.

    export class Chart extends ChartBase {
        private _containerId: string;
        private _chartData: ChartDataProvider;
        private _characteristicCalculator: CharacteristicCalculator;
        private _chartBuilder: ChartConfigurationBuilder;
        private _spectrumChartBuilder: SpectrumChartBuilder;
        private _integralChartBuilder: IntegralChartBuilder;
        private _integralSpectrumChartBuilder: IntegralSpectrumChartBuilder;

        private _characteristicResult: ICharacteristicResult;
        private _spectrumChart: WindowChart;
        private _integralChart: WindowChart;
        private _integralSpectrumChart: WindowChart;

        constructor(containerId: string, seriesId: string, jsonData: any) {
            super();
            this._containerId = containerId;
            this._spectrumChartBuilder = new SpectrumChartBuilder();
            this._integralChartBuilder = new IntegralChartBuilder();
            this._integralSpectrumChartBuilder = new IntegralSpectrumChartBuilder();
            this._chartData = new ChartDataProvider(seriesId, jsonData);
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

            this.cleanUpCharts();

            var windowPoints = this.getWindowsPoints();

            this._spectrumChart = this._spectrumChartBuilder.create({
                containerId: this._containerId + "_spectrum",
                points: windowPoints,
                signalMetadata: this._chartData.signalMetadata
            });

            this._integralChart = this._integralChartBuilder.create({
                containerId: this._containerId + "_integral",
                points: windowPoints,
                signalMetadata: this._chartData.signalMetadata
            });

            this._integralSpectrumChart = this._integralSpectrumChartBuilder.create({
                containerId: this._containerId + "_integral_spectrum",
                points: this._integralChart.chartConfigurationBuilder.chartDataProvider.dataPoints,
                signalMetadata: this._chartData.signalMetadata
            });

            this._spectrumChart.draw();
            this._integralChart.draw();
            this._integralSpectrumChart.draw();
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

        private cleanUpCharts() {

            if (this._spectrumChart) {
                this._spectrumChart.destroy();
            }

            if (this._integralChart) {
                this._integralChart.destroy();
            }

            if (this._integralSpectrumChart) {
                this._integralSpectrumChart.destroy();
            }

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

    class ChartDataProvider extends ChartDataProviderBase {
        private _fileName: string;
        private _characteristics: Characteristics;
        private _signalMetadata: SignalMetadata;
        private _data: Array<DataPoint>;
        private _dataPointMap: IDataPointMap;
        private _sampleRate: number;

        constructor(seriesId: string, jsonObject: any) {
            super();
            this._fileName = jsonObject.FileName;
            this._characteristics = new Characteristics(seriesId, jsonObject.Characteristics);
            this._signalMetadata = new SignalMetadata(jsonObject.SignalMetadata);
            this._data = new Array<DataPoint>();
            this._dataPointMap = {};
            this._sampleRate = this._signalMetadata.dataSize / this._signalMetadata.totalReceiveTime;
            this.initializeData(jsonObject);
        }

        private initializeData(jsonData: any): void {
            var time: number = (new Date()).getTime();
            var frequency: number = 0;
            var frequencyStep: number = this._signalMetadata.totalReceiveTime / this._signalMetadata.dataSize;
            var timeStep: number = 1000;

            const that = this;
            $.each(jsonData.Points, (index, element) => {
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

    export class SignalMetadata {
        private _totalReceiveTime: number;
        private _dataSize: number;
        private _frequencyDefinition: number;

        constructor(jsonData: any) {
            this._totalReceiveTime = jsonData.TotalReceiveTime;
            this._dataSize = jsonData.DataSize;
            this._frequencyDefinition = jsonData.FrequencyDefinition;
        }

        get totalReceiveTime(): number {
            return this._totalReceiveTime;
        }

        get dataSize(): number {
            return this._dataSize;
        }

        get frequencyDefinition(): number {
            return this._frequencyDefinition;
        }
    }

    interface IButton {
        type: string;
        count: number;
        text: string;
    }
}