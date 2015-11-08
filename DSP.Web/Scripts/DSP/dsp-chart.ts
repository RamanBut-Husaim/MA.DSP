// <reference path="../typings/highcharts/highcharts.d.ts"

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
            $('#' + this._containerId).highcharts({
                chart: {
                    zoomType: 'x'
                },
                title: {
                    text: that._chartData.fileName
                },
                xAxis: {
                    type: 'line'
                },
                yAxis: {
                    title: {
                        text: 'Amplitude'
                    }
                },
                legend: {
                    enabled: false
                },
                series: [
                    {
                        type: 'line',
                        name: 'Signal',
                        data: this._chartData.data
                    }
                ]
            });
        }
    }

    class ChartData {
        private _fileName: string;
        private _characteristics: Characteristics;
        private _signalMetadata: SignalMetadata;
        private _data: Array<Array<number>>;

        constructor(jsonObject: any) {
            this._fileName = jsonObject.FileName;
            this._characteristics = new Characteristics(jsonObject.Characteristics);
            this._signalMetadata = new SignalMetadata(jsonObject.SignalMetadata);
            this._data = new Array<Array<number>>();
            this.initializeData(jsonObject);
        }

        private initializeData(jsonData: any): void {
            var frequency: number = 0;
            var step: number = this._signalMetadata.totalReceiveTime / this._signalMetadata.dataSize;

            $.each(jsonData.Points, (index, element) => {
                var point = new Array<number>();
                point.push(frequency, element.Y);
                frequency += step;
                this._data.push(point);
            });
        }

        get fileName(): string {
            return this._fileName;
        }

        get characteristics(): Characteristics {
            return this._characteristics;
        }

        get data(): Array<Array<number>> {
            return this._data;
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
}