﻿module Dsp {
    export class DspChartBuilder {
        private _chartContainerId: string;
        private _processButtonId: string;

        constructor(chartContainerId: string, processButtonId: string) {
            this._chartContainerId = chartContainerId;
            this._processButtonId = processButtonId;
        }

        public createCharts(data: any): void {
            console.log("chartBuilder");
        }

        public subsribeToProcess(): void {
            var url = $('#' + this._processButtonId).attr("data-url");
            $('#' + this._processButtonId).on('click', () => this.retrieveChartData(url));
        }

        public retrieveChartData(url: string): void {
            var fileName = $('#' + this._processButtonId).attr("data-file");
            if (fileName) {
                $.post(url, { fileName: fileName }, (data) => {
                    var chart: Chart = new Chart(this.getChartId(1), data);
                    chart.draw();
                }, 'json');
            }
        }

        private getChartId(index: number): string {
            return 'chartContainer_01';
        }
    }
}