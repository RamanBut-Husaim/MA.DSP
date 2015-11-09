module Dsp {
    export class DataPoint {
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

    export interface IDataPointMap {
        [time: string]: DataPoint;
    }
}