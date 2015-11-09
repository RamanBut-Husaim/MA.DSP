﻿// <reference path="../typings/spin/spin.d.ts"

module Dsp {
    export class DspChartBuilder {
        private _chartContainerPrefix: string;
        private _seriesPrefix: string;
        private _processButtonId: string;
        private _chart: Chart;

        constructor(
            chartContainerPrefix: string,
            seriesPrefix: string,
            processButtonId: string) {
            this._processButtonId = processButtonId;
            this._chartContainerPrefix = chartContainerPrefix;
            this._seriesPrefix = seriesPrefix;
        }

        public createCharts(data: any): void {
            console.log("chartBuilder");
        }

        public subsribeToProcess(): void {
            var url = $('#' + this._processButtonId).attr("data-url");
            $('#' + this._processButtonId).on('click', () => this.retrieveChartData(url));
        }

        public retrieveChartData(url: string): void {
            const that = this;
            var fileName = $('#' + this._processButtonId).attr("data-file");
            if (fileName) {
                var spinner = this.spinChart(this.getChartId(1));
                $.post(url, { fileName: fileName }, (data) => {
                    that._chart = new Chart(this.getChartId(1), this.getSeriesId(1), data);
                    that._chart.draw();
                    that.removeSpin(spinner);
                }, 'json');
            }
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