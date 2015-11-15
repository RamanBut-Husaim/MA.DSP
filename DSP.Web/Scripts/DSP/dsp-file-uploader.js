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
                dataType: 'json',
                done: function (e, data) {
                    $('#' + that._processButtonId)
                        .removeClass('hidden')
                        .attr('data-file', data.result.File);
                },
                fail: function (e, data) {
                    $('#' + that._processButtonId).addClass('hidden');
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
