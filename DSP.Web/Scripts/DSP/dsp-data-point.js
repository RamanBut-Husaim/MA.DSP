var Dsp;
(function (Dsp) {
    var DataPoint = (function () {
        function DataPoint(frequencyValue, xValue, amplitude) {
            this._frequencyValue = frequencyValue;
            this._xValue = xValue;
            this._amplitude = amplitude;
        }
        Object.defineProperty(DataPoint.prototype, "frequency", {
            get: function () {
                return this._frequencyValue;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DataPoint.prototype, "xValue", {
            get: function () {
                return this._xValue;
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