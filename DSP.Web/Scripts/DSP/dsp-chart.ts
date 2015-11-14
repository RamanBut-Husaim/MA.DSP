// <reference path="../typings/highcharts/highstock.d.ts"
// <reference path="../typings/highcharts/highcharts.d.ts"

module Dsp {
    export class Chart {
        private _containerId: string;
        private _chartData: ChartDataProvider;
        private _characteristicCalculator: CharacteristicCalculator;
        private _chartBuilder: ChartConfigurationBuilder;
        private _characteristicResult: ICharacteristicResult;
        private _spectrumChart: SpectrumChart;

        constructor(containerId: string, seriesId: string, jsonData: any) {
            this._containerId = containerId;
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

        public destroy(): void {
            const that = this;
            $.each(Highcharts.charts, (index, chart) => {
                var anyChart: any = chart;
                if ($(anyChart.renderTo).attr("id") === that._containerId) {
                    anyChart.destroy();
                    Highcharts.charts.splice(index, 1);
                    return false;
                }
            });
        }

        public characteristicUpdater(startPoint: number, endPoint: number): void {
            this._characteristicResult = this._characteristicCalculator.calculate(startPoint, endPoint);
            this.setupCharecteristics();

            if (this._spectrumChart) {
                this._spectrumChart.destroy();
            }

            this._spectrumChart = new SpectrumChart(
            {
                containerId: this._containerId + "_spectrum",
                sampleRate: this._chartData.sampleRate,
                points: this.getSpectrumPoints()
            });

            this._spectrumChart.draw();
        }

        private setupCharecteristics(): void {
            this._chartData.characteristics.maxValue = this._characteristicResult.maxValue;
            this._chartData.characteristics.minValue = this._characteristicResult.minValue;
            this._chartData.characteristics.peakFactor = this._characteristicResult.peakFactor;
            this._chartData.characteristics.peekToPeek = this._characteristicResult.peekToPeek;
            this._chartData.characteristics.standardDeviation = this._characteristicResult.standardDeviation;
        }

        private getSpectrumPoints(): Array<number> {

            if (!this._characteristicResult) {
                return new Array<number>();
            }

            var points: Array<number> = new Array<number>();

            var endIndex: number = this._characteristicResult.window.startIndex + this._characteristicResult.window.size;
            for (var i = this._characteristicResult.window.startIndex; i < endIndex; ++i) {
                points.push(this._chartData.dataPoints[i].amplitude);
            }

            return points;
        }
    }

    class ChartDataProvider {
        private _fileName: string;
        private _characteristics: Characteristics;
        private _signalMetadata: SignalMetadata;
        private _data: Array<DataPoint>;
        private _dataPointMap: IDataPointMap;
        private _sampleRate: number;

        constructor(seriesId: string, jsonObject: any) {
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

        get data(): Array<Array<number>> {
            return this._data.map((point) => {
                var pointValues = new Array<number>();
                pointValues.push(point.xValue, point.amplitude);
                return pointValues;
            });
        }

        get dataPoints(): Array<DataPoint> {
            return this._data;
        }

        get dataMap(): IDataPointMap {
            return this._dataPointMap;
        }

        get sampleRate(): number {
            return this._sampleRate;
        }
    }

    class ChartConfigurationBuilder {
        private _chartData: ChartDataProvider;
        private _chart : Chart;

        constructor(chartData: ChartDataProvider, chart: Chart) {
            this._chartData = chartData;
            this._chart = chart;
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
                    inputDateFormat: "%H:%M:%S.%L",
                    inputEditDateFormat: '%H:%M:%S.%L',
                    inputDateParser(value) {
                        var values = value.split(/[:\.]/);
                        return Date.UTC(
                            1970,
                            0,
                            1,
                            parseInt(values[0], 10),
                            parseInt(values[1], 10),
                            parseInt(values[2], 10),
                            parseInt(values[3], 10)
                        );
                    },
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
                        data: that._chartData.data
                    }
                ]
            };

            return result;
        }

        private formatPoint(point: any) : string {
            var resultFormat = '<span style="color:' + point.color + '">\u25CF</span>'
                + point.series.name;

            var dataPoint = this._chartData.dataMap[point.x.toString()];

            if (dataPoint) {
                resultFormat += ': <b>(' + dataPoint.frequency.toString() + ';' + point.y.toString() + ')</b><br/>';
            } else {
                resultFormat += ': <b>' + point.y.toString() + '</b><br/>';
            }

            return resultFormat;
        }

        private generateButtons() : Array<IButton> {
            var initPointNumber: number = 64;
            var exp: number = 6;
            var buttons: Array<IButton> = new Array<IButton>();
            for (var i = initPointNumber; i < this._chartData.data.length; i *= 2) {

                buttons.push({ type: "second", count: i, text: `2^${exp.toString()}` });
                exp++;
            }

            return buttons;
        }
    }

    class SignalMetadata {
        private _totalReceiveTime: number;
        private _dataSize: number;

        constructor(jsonData: any) {
            this._totalReceiveTime = jsonData.TotalReceiveTime;
            this._dataSize = jsonData.DataSize;
        }

        get totalReceiveTime(): number {
            return this._totalReceiveTime;
        }

        get dataSize(): number {
            return this._dataSize;
        }
    }

    interface IButton {
        type: string;
        count: number;
        text: string;
    }
}