// <reference path="../typings/spin/spin.d.ts"
var Dsp;
(function (Dsp) {
    var DspChartBuilder = (function () {
        function DspChartBuilder(chartContainerPrefix, seriesPrefix, processButtonId, messageContainerId) {
            this._processButtonId = processButtonId;
            this._chartContainerPrefix = chartContainerPrefix;
            this._seriesPrefix = seriesPrefix;
            this._messagesContainerId = messageContainerId;
            this._chartManagers = [];
        }
        DspChartBuilder.prototype.subsribeToProcess = function () {
            var _this = this;
            var url = $('#' + this._processButtonId).attr("data-url");
            $('#' + this._processButtonId).on('click', function () {
                $.each(_this._chartManagers, function (index, chartManager) {
                    chartManager.destroyCharts();
                });
                _this._chartManagers.length = 0;
                _this.retrieveChartData(url);
            });
        };
        DspChartBuilder.prototype.retrieveChartData = function (url) {
            var _this = this;
            var that = this;
            var fileName = $("#" + this._processButtonId).attr("data-file");
            if (fileName) {
                var spinner = this.spinChart("#charts");
                $.post(url, { fileName: fileName }, function (data) {
                    $.each(data.Errors, function (index, error) {
                        that.displayErrors(error);
                    });
                    $.each(data.Signals, function (index, signalData) {
                        var chartManager = that.createChartManager(index, signalData);
                        that._chartManagers.push(chartManager);
                        chartManager.drawCharts();
                    });
                    that.removeSpin(spinner);
                    $("#" + _this._processButtonId).removeAttr("data-file");
                }, 'json');
            }
        };
        DspChartBuilder.prototype.createChartManager = function (index, signalData) {
            var template = $("#chartTemplate").html();
            Mustache.parse(template);
            var renderedTemplate = Mustache.render(template, { chartNumber: index, chartName: signalData.FileName });
            $("#charts").append(renderedTemplate);
            var chartManager = new Dsp.ChartManager(this.getChartId(index), this.getSeriesId(index), signalData);
            return chartManager;
        };
        DspChartBuilder.prototype.displayErrors = function (error) {
            var alertType = "alert-danger";
            var template = $("#messageTemplate").html();
            Mustache.parse(template);
            var renderedTemplate = Mustache.render(template, { alertType: alertType, message: error.Message });
            $("#" + this._messagesContainerId).append(renderedTemplate);
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