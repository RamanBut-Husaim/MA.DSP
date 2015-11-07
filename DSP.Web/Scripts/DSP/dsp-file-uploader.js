var Dsp;
(function (Dsp) {
    var DspFileUploader = (function () {
        function DspFileUploader(fileUploadControlId) {
            this._fileUploadControlId = fileUploadControlId;
        }
        DspFileUploader.prototype.initializeFileUpload = function () {
            $('#' + this._fileUploadControlId).fileupload({
                dataType: 'json',
                done: function (e, data) {
                    console.log("one");
                },
                progressall: function (e, data) {
                    var progress = parseInt((data.loaded / data.total * 100).toString(), 10);
                    $("#progress .progress-bar").css("width", progress + '%');
                }
            });
        };
        return DspFileUploader;
    })();
    Dsp.DspFileUploader = DspFileUploader;
})(Dsp || (Dsp = {}));
//# sourceMappingURL=dsp-file-uploader.js.map