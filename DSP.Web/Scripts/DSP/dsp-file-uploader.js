var Dsp;
(function (Dsp) {
    var DspFileUploader = (function () {
        function DspFileUploader(fileUploadControlId, processButtonId) {
            this._fileUploadControlId = fileUploadControlId;
            this._processButtonId = processButtonId;
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
                },
                fail: function (e, data) {
                    $("#" + that._processButtonId).addClass("hidden");
                },
                progressall: function (e, data) {
                    var progress = parseInt((data.loaded / data.total * 100).toString(), 10);
                    $("#progress .progress-bar").css("width", progress + "%");
                }
            });
        };
        return DspFileUploader;
    })();
    Dsp.DspFileUploader = DspFileUploader;
})(Dsp || (Dsp = {}));
//# sourceMappingURL=dsp-file-uploader.js.map