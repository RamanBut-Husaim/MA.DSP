// <reference path="../typings/highcharts/highstock.d.ts"

module Dsp {
    export class Chart {
        private _containerId: string;
        private _chartData: ChartData;

        constructor(containerId: string, jsonData: any) {
            this._containerId = containerId;
            this._chartData = new ChartData(jsonData);
        }

        get containerId(): string {
            return this._containerId;
        }

        public draw(): void {
            const that = this;
            var chartBuilder = new ChartConfigurationBuilder(this._chartData);
            $('#' + this._containerId).highcharts("StockChart", chartBuilder.createConfiguration());
        }
    }

    class ChartData {
        private _fileName: string;
        private _characteristics: Characteristics;
        private _signalMetadata: SignalMetadata;
        private _data: Array<DataPoint>;
        private _dataPointMap: IDataPointMap;

        constructor(jsonObject: any) {
            this._fileName = jsonObject.FileName;
            this._characteristics = new Characteristics(jsonObject.Characteristics);
            this._signalMetadata = new SignalMetadata(jsonObject.SignalMetadata);
            this._data = new Array<DataPoint>();
            this._dataPointMap = {};
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
                pointValues.push(point.time, point.amplitude);
                return pointValues;
            });
        }

        get dataMap(): IDataPointMap {
            return this._dataPointMap;
        }
    }

    class ChartConfigurationBuilder {
        private _chartData: ChartData;

        constructor(chartData: ChartData) {
            this._chartData = chartData;
        }

        public createConfiguration(): HighstockOptions {
            const that = this;
            var buttons: Array<IButton> = this.generateButtons();
            var result = {
                chart: {
                    zoomType: "x",
                    events: {
                        selection(event) {
                        }
                    }
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

    class Characteristics {
        private _maxValue: number;
        private _minValue: number;
        private _peakFactor: number;
        private _peekToPeek: number;
        private _standardDeviation: number;

        constructor(jsonObject: any) {
            this._maxValue = jsonObject.MaxValue;
            this._minValue = jsonObject.MinValue;
            this._peakFactor = jsonObject.PeakFactor;
            this._peekToPeek = jsonObject.PeekToPeek;
            this._standardDeviation = jsonObject.StandardDeviation;
        }

        get maxValue(): number {
            return this._maxValue;
        }

        get minValue(): number {
            return this._minValue;
        }

        get peakFactor(): number {
            return this._peakFactor;
        }

        get peekToPeek(): number {
            return this._peekToPeek;
        }

        get standardDeviation(): number {
            return this._standardDeviation;
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

    class DataPoint {
        private _frequencyValue: number;
        private _timeValue: number;
        private _amplitude: number;

        constructor(frequencyValue: number, timeValue: number, amplitude: number) {
            this._frequencyValue = frequencyValue;
            this._timeValue = timeValue;
            this._amplitude = amplitude;
        }

        get frequency(): number {
            return this._frequencyValue;
        }

        get time(): number {
            return this._timeValue;
        }

        get amplitude(): number {
            return this._amplitude;
        }
    }

    interface IDataPointMap {
        [time: string] : DataPoint;
    }

    interface IButton {
        type: string;
        count: number;
        text: string;
    }
}