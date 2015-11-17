module Dsp {
    export class SpectrumDataProvider extends ChartDataProviderBase {
        private _fftBuilder: FFTBuilder;
        private _sampleRate: number;
        private _frequencyDefinition;
        private _dataPointMap: IDataPointMap;
        private _dataPoints: Array<DataPoint>;

        constructor(signalMetadata: SignalMetadata, points: Array<DataPoint>) {
            super();
            this._sampleRate = signalMetadata.dataSize / signalMetadata.totalReceiveTime;
            this._frequencyDefinition = signalMetadata.frequencyDefinition;
            this._fftBuilder = new FFTBuilder();
            this._dataPointMap = {};
            this.initialize(points);
        }

        private initialize(points: Array<DataPoint>): void {
            var fft = this._fftBuilder.create(points.length, this._sampleRate);
            fft.forward(points.map(p => p.amplitude));

            this._dataPoints = new Array<DataPoint>();
            for (var i = 0; i < fft.spectrum.length; ++i) {
                var dataPoint = new DataPoint(i * this._frequencyDefinition, i, fft.spectrum[i]);
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
}