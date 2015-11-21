module Dsp {
    export class DspFileUploader {
        private _fileUploadControlId: string;
        private _processButtonId: string;
        private _messagesContainerId: string;

        constructor(
            fileUploadControlId: string,
            processButtonId: string,
            messagesContainerId: string) {

            this._fileUploadControlId = fileUploadControlId;
            this._processButtonId = processButtonId;
            this._messagesContainerId = messagesContainerId;
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
                    that.displayMessage(data.result);
                },
                fail(e, data) {
                    $("#" + that._processButtonId).addClass("hidden");
                    that.displayMessage(data.result);
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

        private displayMessage(data): void {
            var alertType = data.Success === true ? "alert-success" : "alert-danger";

            var template = $("#messageTemplate").html();
            Mustache.parse(template);
            var renderedTemplate = Mustache.render(template, { alertType: alertType, message: data.Message });
            $(`#${this._messagesContainerId}`).append(renderedTemplate);
        }
    }
}