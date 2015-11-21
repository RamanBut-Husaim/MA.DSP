module Dsp {
    export class DspFileUploader {
        private _fileUploadControlId: string;
        private _processButtonId: string;

        constructor(fileUploadControlId: string, processButtonId: string) {
            this._fileUploadControlId = fileUploadControlId;
            this._processButtonId = processButtonId;
        }

        public subscribeToFileUpload(): void {
            const that = this;
            $('#' + this._fileUploadControlId).fileupload({
                dataType: "json",
                done(e, data) {
                    var processButton = $(`#${that._processButtonId}`);
                    processButton.removeClass('hidden');
                    var dataFileAttr = processButton.attr("data-file") || "";
                    processButton.attr("data-file", `${dataFileAttr};${data.result.File}`);
                },
                fail(e, data) {
                    $("#" + that._processButtonId).addClass("hidden");
                },
                progressall(e, data) {
                    var progress = parseInt((data.loaded / data.total * 100).toString(), 10);
                    $("#progress .progress-bar").css(
                        "width",
                        progress + "%"
                    );
                }
            });
        }
    }
}