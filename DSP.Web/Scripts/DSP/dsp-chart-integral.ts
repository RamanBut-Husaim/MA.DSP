module Dsp {

    export class IntegralChartData {
        signalMetadata: SignalMetadata;
        dataPoints: Array<DataPoint>;
    }

    export class ChartIntegralDataProvider extends ChartDataProviderBase {
        private _signalMetadata: SignalMetadata;
        private _dataPoints: Array<DataPoint>;
        private _integrationProcessor: IntegrationProcessor;
        private _dataMap: IDataPointMap;

        constructor(signalMetadata: SignalMetadata, points: Array<DataPoint>) {
            super();
            this._signalMetadata = signalMetadata;
            this._integrationProcessor = new IntegrationProcessor(signalMetadata, points);
            this._dataMap = {};
            this.processPoints(points);
        }

        public get dataPoints(): Array<DataPoint> {
            return this._dataPoints;
        }

        public get dataMap(): IDataPointMap {
            return this._dataMap;
        }

        private processPoints(points: Array<DataPoint>): void {
            var resultPoints: Array<DataPoint> = new Array<DataPoint>();
            for (var i = 0; i < points.length; ++i) {
                var point: DataPoint = points[i];
                var amplitude: number = this._integrationProcessor.calcualteValueForPoint(point);
                var dataPoint = new DataPoint(point.frequency, point.frequency, amplitude);
                resultPoints.push(dataPoint);
                this._dataMap[dataPoint.xValue.toString()] = dataPoint;
            }
        }
    }

    class HarmonicInfo {
        amplitude: number;
        frequency: number;
        phase: number;
        velocityPhase: number;
        vibrationVelocityAmplitude : number;
    }

    class IntegrationProcessor {
        private _harmonicInfos: Array<HarmonicInfo>;
        private _signalMetadata: SignalMetadata;
        private _fftBuilder = new FFTBuilder();
        private _integrationConstant: number;

        constructor(signalMetadata: SignalMetadata, points: Array<DataPoint>) {
            this._signalMetadata = signalMetadata;
            this._fftBuilder = new FFTBuilder();
            this._harmonicInfos = this.gatherHarmonicInfo(points);
            this._integrationConstant = this.calculateIntegrationConstant();
        }

        public get integrationConstant(): number {
            return this._integrationConstant;
        }

        public calcualteValueForPoint(point: DataPoint): number {
            var pointValue: number = 0;
            for (var i = 0; i < this._harmonicInfos.length; ++i) {
                var harmonicInfo = this._harmonicInfos[i];
                pointValue += (harmonicInfo.vibrationVelocityAmplitude * Math.cos(2 * Math.PI * harmonicInfo.frequency * point.frequency - harmonicInfo.velocityPhase));
            }

            pointValue += this._integrationConstant;

            return pointValue;
        }

        private gatherHarmonicInfo(points: Array<DataPoint>): Array<HarmonicInfo> {
            var sampleRate: number = this._signalMetadata.dataSize * this._signalMetadata.totalReceiveTime;
            var fft = this._fftBuilder.create(points.length, sampleRate);

            fft.forward(points.map(p => p.amplitude));
            const that = this;

            var harmonicInfos: Array<HarmonicInfo> = new Array<HarmonicInfo>();

            for (var index = 1; index < fft.spectrum.length; ++index) {
                var harmonicInfo = new HarmonicInfo();
                harmonicInfo.amplitude = fft.spectrum[index];
                harmonicInfo.frequency = that._signalMetadata.frequencyDefinition * index;
                harmonicInfo.phase = Math.atan2(fft.imag[index], fft.real[index]);
                harmonicInfo.velocityPhase = harmonicInfo.phase - Math.PI / 2;
                harmonicInfo.vibrationVelocityAmplitude = fft.spectrum[index] / (2 * Math.PI * harmonicInfo.frequency);
                harmonicInfos.push(harmonicInfo);
            }

            return harmonicInfos;
        }

        private calculateIntegrationConstant(): number {
            var integrationConstant: number = 0;
            for (var i = 0; i < this._harmonicInfos.length; ++i) {
                integrationConstant += (this._harmonicInfos[i].vibrationVelocityAmplitude * Math.sin(this._harmonicInfos[i].phase));
            }

            return integrationConstant;
        }
    }
}