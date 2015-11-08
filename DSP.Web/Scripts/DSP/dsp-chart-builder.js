var Dsp;
(function (Dsp) {
    var DspChartBuilder = (function () {
        function DspChartBuilder(chartContainerId, processButtonId) {
            this._chartContainerId = chartContainerId;
            this._processButtonId = processButtonId;
        }
        DspChartBuilder.prototype.createCharts = function (data) {
            console.log("chartBuilder");
        };
        DspChartBuilder.prototype.subsribeToProcess = function () {
            var _this = this;
            var url = $('#' + this._processButtonId).attr("data-url");
            $('#' + this._processButtonId).on('click', function () { return _this.retrieveChartData(url); });
        };
        DspChartBuilder.prototype.retrieveChartData = function (url) {
            var fileName = $('#' + this._processButtonId).attr("data-file");
            if (fileName) {
                $.post(url, { fileName: fileName }, function (data) {
                    console.log(data);
                }, 'json');
            }
        };
        return DspChartBuilder;
    })();
    Dsp.DspChartBuilder = DspChartBuilder;
})(Dsp || (Dsp = {}));
//# sourceMappingURL=dsp-chart-builder.js.map