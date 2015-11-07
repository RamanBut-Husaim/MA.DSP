var Dsp;
(function (Dsp) {
    var DspService = (function () {
        function DspService(fileUploader) {
            this._fileUploader = fileUploader;
        }
        DspService.prototype.setup = function () {
            this._fileUploader.initializeFileUpload();
        };
        return DspService;
    })();
    Dsp.DspService = DspService;
})(Dsp || (Dsp = {}));
//# sourceMappingURL=dsp-service.js.map