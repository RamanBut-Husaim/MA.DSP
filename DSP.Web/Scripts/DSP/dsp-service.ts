module Dsp {
    export class DspService {
        private _fileUploader: DspFileUploader;

        constructor(fileUploader: DspFileUploader) {
            this._fileUploader = fileUploader;
        }

        public setup(): void {
            this._fileUploader.initializeFileUpload();
        }
    }
}