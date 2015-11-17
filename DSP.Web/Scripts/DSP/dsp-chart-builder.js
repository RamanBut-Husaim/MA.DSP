// <reference path="../typings/spin/spin.d.ts"
var Dsp;
(function (Dsp) {
    var DspChartBuilder = (function () {
        function DspChartBuilder(chartContainerPrefix, seriesPrefix, processButtonId) {
            this._processButtonId = processButtonId;
            this._chartContainerPrefix = chartContainerPrefix;
            this._seriesPrefix = seriesPrefix;
        }
        DspChartBuilder.prototype.createCharts = function (data) {
            console.log("chartBuilder");
        };
        DspChartBuilder.prototype.subsribeToProcess = function () {
            var _this = this;
            var url = $('#' + this._processButtonId).attr("data-url");
            $('#' + this._processButtonId).on('click', function () {
                if (_this._chartManager) {
                    _this._chartManager.destroyCharts();
                }
                _this.retrieveChartData(url);
            });
        };
        DspChartBuilder.prototype.retrieveChartData = function (url) {
            var _this = this;
            var that = this;
            var fileName = $('#' + this._processButtonId).attr("data-file");
            if (fileName) {
                var spinner = this.spinChart(this.getChartId(1));
                $.post(url, { fileName: fileName }, function (data) {
                    that._chartManager = new Dsp.ChartManager(_this.getChartId(1), _this.getSeriesId(1), data);
                    that._chartManager.drawCharts();
                    that.removeSpin(spinner);
                }, 'json');
            }
        };
        DspChartBuilder.prototype.getChartId = function (index) {
            return this._chartContainerPrefix + index.toString();
        };
        DspChartBuilder.prototype.getSeriesId = function (index) {
            return this._seriesPrefix + index.toString();
        };
        DspChartBuilder.prototype.spinChart = function (chartId) {
            var spinner = new Spinner();
            spinner.spin(document.getElementById(chartId));
            return spinner;
        };
        DspChartBuilder.prototype.removeSpin = function (spinner) {
            spinner.stop();
        };
        return DspChartBuilder;
    })();
    Dsp.DspChartBuilder = DspChartBuilder;
})(Dsp || (Dsp = {}));
//# sourceMappingURL=dsp-chart-builder.js.map