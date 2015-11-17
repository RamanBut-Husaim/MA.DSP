var Dsp;
(function (Dsp) {
    var ChartManager = (function () {
        function ChartManager(containerId, seriesId, jsonData) {
            this._containerId = containerId;
            this._seriesId = seriesId;
            this._signalMetadata = new Dsp.SignalMetadata(jsonData.SignalMetadata);
            this.createMainChart(jsonData);
            this.createChartBuilders();
        }
        ChartManager.prototype.createChartBuilders = function () {
            this._spectrumChartBuilder = new Dsp.SpectrumChartBuilder();
            this._integralChartBuilder = new Dsp.IntegralChartBuilder();
            this._integralSpectrumChartBuilder = new Dsp.IntegralSpectrumChartBuilder();
        };
        ChartManager.prototype.createMainChart = function (jsonData) {
            this._mainChart = new Dsp.Chart({
                containerId: this._containerId,
                seriesId: this._seriesId,
                fileName: jsonData.FileName,
                signalMetadata: this._signalMetadata,
                characteristics: jsonData.Characteristics,
                points: jsonData.Points,
                chartManager: this
            });
        };
        ChartManager.prototype.drawCharts = function () {
            this._mainChart.draw();
        };
        ChartManager.prototype.destroyCharts = function () {
            this.cleanUpCharts();
            this._mainChart.destroy();
        };
        ChartManager.prototype.redrawWindowCharts = function (points) {
            this.cleanUpCharts();
            this._spectrumChart = this.createSpectrumChart(points);
            this._integralChart = this.createIntegralChart(points);
            this._integralSpectrumChart = this.createIntegramSpectrumChart(this._integralChart.chartConfigurationBuilder.chartDataProvider.dataPoints);
            var chartsToDraw = [
                this._spectrumChart,
                this._integralChart,
                this._integralSpectrumChart];
            $.each(chartsToDraw, function (index, chart) {
                chart.draw();
            });
        };
        ChartManager.prototype.createSpectrumChart = function (points) {
            return this._spectrumChartBuilder.create({
                containerId: this._containerId + "_spectrum",
                points: points,
                signalMetadata: this._signalMetadata
            });
        };
        ChartManager.prototype.createIntegralChart = function (points) {
            return this._integralChartBuilder.create({
                containerId: this._containerId + "_integral",
                points: points,
                signalMetadata: this._signalMetadata
            });
        };
        ChartManager.prototype.createIntegramSpectrumChart = function (points) {
            return this._integralSpectrumChartBuilder.create({
                containerId: this._containerId + "_integral_spectrum",
                points: points,
                signalMetadata: this._signalMetadata
            });
        };
        ChartManager.prototype.cleanUpCharts = function () {
            var chartsToDestroy = [
                this._spectrumChart,
                this._integralChart,
                this._integralSpectrumChart];
            $.each(chartsToDestroy, function (index, chart) {
                if (chart) {
                    chart.destroy();
                }
            });
            var validCharts = new Array();
            $.each(Highcharts.charts, function (index, chart) {
                if (chart != undefined) {
                    validCharts.push(chart);
                }
            });
            Highcharts.charts.length = 0;
            validCharts.forEach(function (chart) { return Highcharts.charts.push(chart); });
        };
        return ChartManager;
    })();
    Dsp.ChartManager = ChartManager;
})(Dsp || (Dsp = {}));
//# sourceMappingURL=dsp-chart-manager.js.map