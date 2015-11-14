module Dsp {
    export class DataPoint {
        private _frequencyValue: number;
        private _xValue: number;
        private _amplitude: number;

        constructor(frequencyValue: number, xValue: number, amplitude: number) {
            this._frequencyValue = frequencyValue;
            this._xValue = xValue;
            this._amplitude = amplitude;
        }

        get frequency(): number {
            return this._frequencyValue;
        }

        get xValue(): number {
            return this._xValue;
        }

        get amplitude(): number {
            return this._amplitude;
        }
    }

    export interface IDataPointMap {
        [xValue: string]: DataPoint;
    }
}