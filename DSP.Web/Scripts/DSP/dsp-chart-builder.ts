// <reference path="../typings/spin/spin.d.ts"

module Dsp {
    export class DspChartBuilder {
        private _chartContainerPrefix: string;
        private _seriesPrefix: string;
        private _processButtonId: string;
        private _messagesContainerId: string;
        private _chartManagers: ChartManager[];

        constructor(
            chartContainerPrefix: string,
            seriesPrefix: string,
            processButtonId: string,
        messageContainerId: string) {
            this._processButtonId = processButtonId;
            this._chartContainerPrefix = chartContainerPrefix;
            this._seriesPrefix = seriesPrefix;
            this._messagesContainerId = messageContainerId;
            this._chartManagers = [];
        }

        public subsribeToProcess(): void {
            var url = $('#' + this._processButtonId).attr("data-url");
            $('#' + this._processButtonId).on('click', () => {
                $.each(this._chartManagers, (index, chartManager) => {
                    chartManager.destroyCharts();
                });

                this._chartManagers.length = 0;

                this.retrieveChartData(url);
            });
        }

        private retrieveChartData(url: string): void {
            const that = this;
            var fileName = $(`#${this._processButtonId}`).attr("data-file");
            if (fileName) {
                var spinner = this.spinChart("#charts");
                $.post(url, { fileName: fileName }, (data) => {

                    $.each(data.Errors, (index, error) => {
                        that.displayErrors(error);
                    });

                    $.each(data.Signals, (index, signalData) => {
                        var chartManager = that.createChartManager(index, signalData);
                        that._chartManagers.push(chartManager);
                        chartManager.drawCharts();
                    });

                    that.removeSpin(spinner);
                    $(`#${this._processButtonId}`).removeAttr("data-file");
                }, 'json');
            }
        }

        private createChartManager(index, signalData): ChartManager {
            var template = $("#chartTemplate").html();
            Mustache.parse(template);
            var renderedTemplate = Mustache.render(template, { chartNumber: index, chartName: signalData.FileName });
            $("#charts").append(renderedTemplate);

            var chartManager = new ChartManager(this.getChartId(index), this.getSeriesId(index), signalData);

            return chartManager;
        }

        private displayErrors(error): void {
            var alertType = "alert-danger";

            var template = $("#messageTemplate").html();
            Mustache.parse(template);
            var renderedTemplate = Mustache.render(template, { alertType: alertType, message: error.Message });
            $(`#${this._messagesContainerId}`).append(renderedTemplate);
        }

        private getChartId(index: number): string {
            return this._chartContainerPrefix + index.toString();
        }

        private getSeriesId(index: number): string {
            return this._seriesPrefix + index.toString();
        }

        private spinChart(chartId: string): Spinner {
            var spinner = new Spinner();
            spinner.spin(document.getElementById(chartId));
            return spinner;
        }

        private removeSpin(spinner: Spinner): void {
            spinner.stop();
        }
    }
}