var Dsp;
(function (Dsp) {
    var DspFileUploader = (function () {
        function DspFileUploader(fileUploadControlId, processButtonId, messagesContainerId) {
            this._fileUploadControlId = fileUploadControlId;
            this._processButtonId = processButtonId;
            this._messagesContainerId = messagesContainerId;
        }
        DspFileUploader.prototype.subscribeToFileUpload = function () {
            var that = this;
            $('#' + this._fileUploadControlId).fileupload({
                dataType: "json",
                done: function (e, data) {
                    var processButton = $("#" + that._processButtonId);
                    processButton.removeClass('hidden');
                    var dataFileAttr = processButton.attr("data-file") || "";
                    processButton.attr("data-file", dataFileAttr + ";" + data.result.File);
                    that.displayMessage(data.result);
                },
                fail: function (e, data) {
                    $("#" + that._processButtonId).addClass("hidden");
                    that.displayMessage(data.result);
                },
                progressall: function (e, data) {
                    var progress = parseInt((data.loaded / data.total * 100).toString(), 10);
                    $("#progress .progress-bar").css("width", progress + "%");
                }
            });
        };
        DspFileUploader.prototype.displayMessage = function (data) {
            var alertType = data.Success === true ? "alert-success" : "alert-danger";
            var template = $("#messageTemplate").html();
            Mustache.parse(template);
            var renderedTemplate = Mustache.render(template, { alertType: alertType, message: data.Message });
            $("#" + this._messagesContainerId).append(renderedTemplate);
        };
        return DspFileUploader;
    })();
    Dsp.DspFileUploader = DspFileUploader;
})(Dsp || (Dsp = {}));
//# sourceMappingURL=dsp-file-uploader.js.map