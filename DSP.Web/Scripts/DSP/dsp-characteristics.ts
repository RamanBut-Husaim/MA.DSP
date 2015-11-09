module Dsp {
    export class Characteristics {
        private _minValueLabel: JQuery;
        private _maxValueLabel: JQuery;
        private _peakFactorLabel: JQuery;
        private _peekToPeekLabel: JQuery;
        private _standardDeviationLabel: JQuery;

        private _seriesId: string;
        private _maxValue: number;
        private _minValue: number;
        private _peakFactor: number;
        private _peekToPeek: number;
        private _standardDeviation: number;

        constructor(seriesId: string, jsonObject: any) {
            this._seriesId = seriesId;
            this.setupValue("minValue", jsonObject.MinValue);
            this.setupValue("maxValue", jsonObject.MaxValue);
            this.setupValue("peakFactor", jsonObject.PeakFactor);
            this.setupValue("peekToPeek", jsonObject.PeekToPeek);
            this.setupValue("standardDeviation", jsonObject.StandardDeviation);
        }

        private setupValue(property: string, value: number): void {
            this[`_${property}`] = value;
            this[`_${property}Label`] = $(`#${this._seriesId}`)
                .find(`div[data-type="${property}"]`)
                .find("span");
            this[`_${property}Label`].html(value.toString());
        }

        get maxValue(): number {
            return this._maxValue;
        }

        set maxValue(value: number) {
            this._maxValue = value;
            this._maxValueLabel.html(value.toString());
        }

        get minValue(): number {
            return this._minValue;
        }

        set minValue(value: number) {
            this._minValue = value;
            this._minValueLabel.html(value.toString());
        }

        get peakFactor(): number {
            return this._peakFactor;
        }

        set peakFactor(value: number) {
            this._peakFactor = value;
            this._peakFactorLabel.html(value.toString());
        }

        get peekToPeek(): number {
            return this._peekToPeek;
        }

        set peekToPeek(value: number) {
            this._peekToPeek = value;
            this._peekToPeekLabel.html(value.toString());
        }

        get standardDeviation(): number {
            return this._standardDeviation;
        }

        set standardDeviation(value: number) {
            this._standardDeviation = value;
            this._standardDeviationLabel.html(value.toString());
        }
    }

    export class CharacteristicCalculator {
        private _dataPoints: Array<DataPoint>;

        private _minValueCharacteristic: ICharacteristic<number>;
        private _maxValueCharacteristic: ICharacteristic<number>;
        private _peekToPeekCharacteristic: ICharacteristic<number>;
        private _peakFactorCharacteristic: ICharacteristic<number>;
        private _standardDeviationCharacteristic: ICharacteristic<number>;

        constructor(dataPoints: Array<DataPoint>) {
            this._dataPoints = dataPoints;

            this._minValueCharacteristic = new MinValueCharacteristic(dataPoints);
            this._maxValueCharacteristic = new MaxValueCharacteristic(dataPoints);
            this._peakFactorCharacteristic = new PeakFactorCharacteristic(dataPoints);
            this._peekToPeekCharacteristic = new PeekToPeekCharacteristic(dataPoints);
            this._standardDeviationCharacteristic = new StandardDeviationCharacteristic(dataPoints);
        }

        public calculate(startPoint: number, endPoint: number) : ICharacteristicResult {
            var startIndex: number = this.searchNextToMin(startPoint);
            var endIndex: number = this.searchBeforeMax(endPoint);

            return {
                minValue: this._minValueCharacteristic.calculate(startIndex, endIndex),
                maxValue: this._maxValueCharacteristic.calculate(startIndex, endIndex),
                peekToPeek: this._peekToPeekCharacteristic.calculate(startIndex, endIndex),
                peakFactor: this._peakFactorCharacteristic.calculate(startIndex, endIndex),
                standardDeviation: this._standardDeviationCharacteristic.calculate(startIndex, endIndex)
            };
        }

        private searchNextToMin(key: number): number {
            for (var i = 0; i < this._dataPoints.length; ++i) {
                if (this._dataPoints[i].time >= key) {
                    return i;
                }
            }

            return this._dataPoints.length - 1;
        }

        private searchBeforeMax(key: number): number {
            for (var i = this._dataPoints.length - 1; i >= 0; --i) {
                if (key >= this._dataPoints[i].time) {
                    return i + 1;
                }
            }

            return 0;
        }

        private binarySearch(key: number) : number {
            var lo: number = 0,
                hi: number = this._dataPoints.length - 1,
                mid: number,
                element: DataPoint;

            while (lo <= hi) {
                mid = ((lo + hi) >> 1);
                element = this._dataPoints[mid];
                if (element.time < key) {
                    lo = mid + 1;
                } else if (element.time > key) {
                    hi = mid - 1;
                } else {
                    return mid;
                }
            }

            return -1;
        }
    }

    export interface ICharacteristicResult {
        maxValue: number;
        minValue: number;
        peekToPeek: number;
        peakFactor: number;
        standardDeviation: number;
    }

    interface ICharacteristic<T> {
        calculate(startPoint: number, endPoint: number) : T;
    }

    abstract class CharacteristicBase<T> implements ICharacteristic<T> {
        private _signalData: Array<DataPoint>;

        constructor(dataPoints: Array<DataPoint>) {
            this._signalData = dataPoints;
        }

        protected get signalData(): Array<DataPoint> {
            return this._signalData;
        }

        calculate(startPoint: number, endPoint: number): T {
            var actualStartPoint: number = Math.min(startPoint, endPoint);
            var actualEndPoint: number = Math.max(startPoint, endPoint);
            actualStartPoint = Math.max(0, actualStartPoint);
            actualEndPoint = Math.max(0, actualEndPoint);
            actualEndPoint = Math.min(actualEndPoint, this.signalData.length);

            return this.calculateInternal(actualStartPoint, actualEndPoint);
        }

        abstract calculateInternal(startPoint: number, endPoint: number);
    }

    class MinValueCharacteristic extends CharacteristicBase<number> {

        constructor(dataPoints: Array<DataPoint>) {
            super(dataPoints);
        }

        calculateInternal(startPoint: number, endPoint: number) {
            var minValue: number = Number.MAX_VALUE;

            if (this.signalData.length === 0) {
                return Number.NEGATIVE_INFINITY;
            }

            for (var i = startPoint; i < endPoint; ++i)
            {
                if (minValue > this.signalData[i].amplitude) {
                    minValue = this.signalData[i].amplitude;
                }
            }

            return minValue;
        }
    }

    class MaxValueCharacteristic extends CharacteristicBase<number> {

        constructor(dataPoints: Array<DataPoint>) {
            super(dataPoints);
        }

        calculateInternal(startPoint: number, endPoint: number) {
            var maxValue: number = -Number.MAX_VALUE;

            if (this.signalData.length === 0) {
                return Number.NEGATIVE_INFINITY;
            }

            for (var i = startPoint; i < endPoint; ++i)
            {
                if (maxValue < this.signalData[i].amplitude) {
                    maxValue = this.signalData[i].amplitude;
                }
            }

            return maxValue;
        }
    }

    class PeakFactorCharacteristic extends CharacteristicBase<number> {
        private _minValueCharacteristic: ICharacteristic<number>;
        private _maxValueCharacteristic: ICharacteristic<number>;
        private _standardDeviationCharacteristic: ICharacteristic<number>;

        constructor(dataPoints: Array<DataPoint>) {
            super(dataPoints);
            this._minValueCharacteristic = new MinValueCharacteristic(dataPoints);
            this._maxValueCharacteristic = new MaxValueCharacteristic(dataPoints);
            this._standardDeviationCharacteristic = new StandardDeviationCharacteristic(dataPoints);
        }

        calculateInternal(startPoint: number, endPoint: number) {
            var maxValue: number = this._maxValueCharacteristic.calculate(startPoint, endPoint);
            var minValue: number = this._minValueCharacteristic.calculate(startPoint, endPoint);
            var standardDeviation: number = this._standardDeviationCharacteristic.calculate(startPoint, endPoint);

            var peakFactor: number = Math.max(Math.abs(maxValue), Math.abs(minValue)) / standardDeviation;

            return peakFactor;
        }
    }

    class PeekToPeekCharacteristic extends CharacteristicBase<number> {
        private _minValueCharacteristic: ICharacteristic<number>;
        private _maxValueCharacteristic: ICharacteristic<number>;

        constructor(dataPoints: Array<DataPoint>) {
            super(dataPoints);
            this._minValueCharacteristic = new MinValueCharacteristic(dataPoints);
            this._maxValueCharacteristic = new MaxValueCharacteristic(dataPoints);
        }

        calculateInternal(startPoint: number, endPoint: number) {
            var maxValue: number = this._maxValueCharacteristic.calculate(startPoint, endPoint);
            var minValue: number = this._minValueCharacteristic.calculate(startPoint, endPoint);

            return maxValue - minValue;
        }
    }

    class StandardDeviationCharacteristic extends CharacteristicBase<number> {

        constructor(dataPoints: Array<DataPoint>) {
            super(dataPoints);
        }

        calculateInternal(startPoint: number, endPoint: number) {
            var pointNumber: number = endPoint - startPoint;

            var sum: number = 0;
            for (var i = startPoint; i < endPoint; ++i)
            {
                sum += (this.signalData[i].amplitude * this.signalData[i].amplitude);
            }

            sum = sum / pointNumber;

            return Math.sqrt(sum);
        }
    }
}