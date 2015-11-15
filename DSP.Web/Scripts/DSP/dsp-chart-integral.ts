module Dsp {

    export class IntegralChartData {
        signalMetadata: SignalMetadata;
        dataPoints: Array<DataPoint>;
    }

    export class ChartIntegralDataProvider {
        private _signalMetadata: SignalMetadata;
        private _fftBuilder: FFTBuilder;
        private _dataPoints: Array<DataPoint>;

        constructor(signalMetadata: SignalMetadata, points: Array<DataPoint>) {
            this._signalMetadata = signalMetadata;
            this._fftBuilder = new FFTBuilder();
            this.processPoints(points);
        }

        private processPoints(points: Array<DataPoint>): void {
            var harmonicInfos = this.gatherHarmonicInfo(points);
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
                harmonicInfo.phase = Math.atan2(fft.imag[index], fft.real[index]) - Math.PI / 2;
                harmonicInfo.vibrationVelocityAmplitude = fft.spectrum[index] / (2 * Math.PI * harmonicInfo.frequency);
                harmonicInfos.push(harmonicInfo);
            }

            return harmonicInfos;
        }


    }

    class HarmonicInfo {
        amplitude: number;
        frequency: number;
        phase: number;
        vibrationVelocityAmplitude : number;
    }
}