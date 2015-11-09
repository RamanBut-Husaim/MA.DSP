var Dsp;
(function (Dsp) {
    var DataPoint = (function () {
        function DataPoint(frequencyValue, timeValue, amplitude) {
            this._frequencyValue = frequencyValue;
            this._timeValue = timeValue;
            this._amplitude = amplitude;
        }
        Object.defineProperty(DataPoint.prototype, "frequency", {
            get: function () {
                return this._frequencyValue;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DataPoint.prototype, "time", {
            get: function () {
                return this._timeValue;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DataPoint.prototype, "amplitude", {
            get: function () {
                return this._amplitude;
            },
            enumerable: true,
            configurable: true
        });
        return DataPoint;
    })();
    Dsp.DataPoint = DataPoint;
})(Dsp || (Dsp = {}));
//# sourceMappingURL=dsp-data-point.js.map