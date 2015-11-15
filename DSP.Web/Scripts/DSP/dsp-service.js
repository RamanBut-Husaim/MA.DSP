var Dsp;
(function (Dsp) {
    var DspService = (function () {
        function DspService(fileUploader, chartBuilder) {
            this._fileUploader = fileUploader;
            this._chartBuilder = chartBuilder;
        }
        DspService.prototype.setup = function () {
            this._fileUploader.subscribeToFileUpload();
            this._chartBuilder.subsribeToProcess();
        };
        return DspService;
    })();
    Dsp.DspService = DspService;
})(Dsp || (Dsp = {}));
