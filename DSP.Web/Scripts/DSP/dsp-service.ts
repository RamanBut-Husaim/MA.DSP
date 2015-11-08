module Dsp {
    export class DspService {
        private _fileUploader: DspFileUploader;
        private _chartBuilder: DspChartBuilder;

        constructor(fileUploader: DspFileUploader, chartBuilder: DspChartBuilder) {
            this._fileUploader = fileUploader;
            this._chartBuilder = chartBuilder;
        }

        public setup(): void {
            this._fileUploader.subscribeToFileUpload();
            this._chartBuilder.subsribeToProcess();
        }
    }
}