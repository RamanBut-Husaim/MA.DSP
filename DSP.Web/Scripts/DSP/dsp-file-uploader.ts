module Dsp {
    export class DspFileUploader {
        private _fileUploadControlId: string;

        constructor(fileUploadControlId: string) {
            this._fileUploadControlId = fileUploadControlId;
        }

        public initializeFileUpload(): void {
            $('#' + this._fileUploadControlId).fileupload({
                dataType: 'json',
                done(e, data) {
                    console.log("one");
                },
                progressall(e, data) {
                    var progress = parseInt((data.loaded / data.total * 100).toString(), 10);
                    $("#progress .progress-bar").css(
                        "width",
                        progress + '%'
                    );
                }
            });
        }
    }
}