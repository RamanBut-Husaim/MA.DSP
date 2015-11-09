var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Dsp;
(function (Dsp) {
    var Characteristics = (function () {
        function Characteristics(seriesId, jsonObject) {
            this._seriesId = seriesId;
            this.setupValue("minValue", jsonObject.MinValue);
            this.setupValue("maxValue", jsonObject.MaxValue);
            this.setupValue("peakFactor", jsonObject.PeakFactor);
            this.setupValue("peekToPeek", jsonObject.PeekToPeek);
            this.setupValue("standardDeviation", jsonObject.StandardDeviation);
        }
        Characteristics.prototype.setupValue = function (property, value) {
            this[("_" + property)] = value;
            this[("_" + property + "Label")] = $("#" + this._seriesId)
                .find("div[data-type=\"" + property + "\"]")
                .find("span");
            this[("_" + property + "Label")].html(value.toString());
        };
        Object.defineProperty(Characteristics.prototype, "maxValue", {
            get: function () {
                return this._maxValue;
            },
            set: function (value) {
                this._maxValue = value;
                this._maxValueLabel.html(value.toString());
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Characteristics.prototype, "minValue", {
            get: function () {
                return this._minValue;
            },
            set: function (value) {
                this._minValue = value;
                this._minValueLabel.html(value.toString());
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Characteristics.prototype, "peakFactor", {
            get: function () {
                return this._peakFactor;
            },
            set: function (value) {
                this._peakFactor = value;
                this._peakFactorLabel.html(value.toString());
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Characteristics.prototype, "peekToPeek", {
            get: function () {
                return this._peekToPeek;
            },
            set: function (value) {
                this._peekToPeek = value;
                this._peekToPeekLabel.html(value.toString());
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Characteristics.prototype, "standardDeviation", {
            get: function () {
                return this._standardDeviation;
            },
            set: function (value) {
                this._standardDeviation = value;
                this._standardDeviationLabel.html(value.toString());
            },
            enumerable: true,
            configurable: true
        });
        return Characteristics;
    })();
    Dsp.Characteristics = Characteristics;
    var CharacteristicCalculator = (function () {
        function CharacteristicCalculator(dataPoints) {
            this._dataPoints = dataPoints;
            this._minValueCharacteristic = new MinValueCharacteristic(dataPoints);
            this._maxValueCharacteristic = new MaxValueCharacteristic(dataPoints);
            this._peakFactorCharacteristic = new PeakFactorCharacteristic(dataPoints);
            this._peekToPeekCharacteristic = new PeekToPeekCharacteristic(dataPoints);
            this._standardDeviationCharacteristic = new StandardDeviationCharacteristic(dataPoints);
        }
        CharacteristicCalculator.prototype.calculate = function (startPoint, endPoint) {
            var startIndex = this.searchNextToMin(startPoint);
            var endIndex = this.searchBeforeMax(endPoint);
            return {
                minValue: this._minValueCharacteristic.calculate(startIndex, endIndex),
                maxValue: this._maxValueCharacteristic.calculate(startIndex, endIndex),
                peekToPeek: this._peekToPeekCharacteristic.calculate(startIndex, endIndex),
                peakFactor: this._peakFactorCharacteristic.calculate(startIndex, endIndex),
                standardDeviation: this._standardDeviationCharacteristic.calculate(startIndex, endIndex)
            };
        };
        CharacteristicCalculator.prototype.searchNextToMin = function (key) {
            for (var i = 0; i < this._dataPoints.length; ++i) {
                if (this._dataPoints[i].time >= key) {
                    return i;
                }
            }
            return this._dataPoints.length - 1;
        };
        CharacteristicCalculator.prototype.searchBeforeMax = function (key) {
            for (var i = this._dataPoints.length - 1; i >= 0; --i) {
                if (key >= this._dataPoints[i].time) {
                    return i + 1;
                }
            }
            return 0;
        };
        CharacteristicCalculator.prototype.binarySearch = function (key) {
            var lo = 0, hi = this._dataPoints.length - 1, mid, element;
            while (lo <= hi) {
                mid = ((lo + hi) >> 1);
                element = this._dataPoints[mid];
                if (element.time < key) {
                    lo = mid + 1;
                }
                else if (element.time > key) {
                    hi = mid - 1;
                }
                else {
                    return mid;
                }
            }
            return -1;
        };
        return CharacteristicCalculator;
    })();
    Dsp.CharacteristicCalculator = CharacteristicCalculator;
    var CharacteristicBase = (function () {
        function CharacteristicBase(dataPoints) {
            this._signalData = dataPoints;
        }
        Object.defineProperty(CharacteristicBase.prototype, "signalData", {
            get: function () {
                return this._signalData;
            },
            enumerable: true,
            configurable: true
        });
        CharacteristicBase.prototype.calculate = function (startPoint, endPoint) {
            var actualStartPoint = Math.min(startPoint, endPoint);
            var actualEndPoint = Math.max(startPoint, endPoint);
            actualStartPoint = Math.max(0, actualStartPoint);
            actualEndPoint = Math.max(0, actualEndPoint);
            actualEndPoint = Math.min(actualEndPoint, this.signalData.length);
            return this.calculateInternal(actualStartPoint, actualEndPoint);
        };
        return CharacteristicBase;
    })();
    var MinValueCharacteristic = (function (_super) {
        __extends(MinValueCharacteristic, _super);
        function MinValueCharacteristic(dataPoints) {
            _super.call(this, dataPoints);
        }
        MinValueCharacteristic.prototype.calculateInternal = function (startPoint, endPoint) {
            var minValue = Number.MAX_VALUE;
            if (this.signalData.length === 0) {
                return Number.NEGATIVE_INFINITY;
            }
            for (var i = startPoint; i < endPoint; ++i) {
                if (minValue > this.signalData[i].amplitude) {
                    minValue = this.signalData[i].amplitude;
                }
            }
            return minValue;
        };
        return MinValueCharacteristic;
    })(CharacteristicBase);
    var MaxValueCharacteristic = (function (_super) {
        __extends(MaxValueCharacteristic, _super);
        function MaxValueCharacteristic(dataPoints) {
            _super.call(this, dataPoints);
        }
        MaxValueCharacteristic.prototype.calculateInternal = function (startPoint, endPoint) {
            var maxValue = -Number.MAX_VALUE;
            if (this.signalData.length === 0) {
                return Number.NEGATIVE_INFINITY;
            }
            for (var i = startPoint; i < endPoint; ++i) {
                if (maxValue < this.signalData[i].amplitude) {
                    maxValue = this.signalData[i].amplitude;
                }
            }
            return maxValue;
        };
        return MaxValueCharacteristic;
    })(CharacteristicBase);
    var PeakFactorCharacteristic = (function (_super) {
        __extends(PeakFactorCharacteristic, _super);
        function PeakFactorCharacteristic(dataPoints) {
            _super.call(this, dataPoints);
            this._minValueCharacteristic = new MinValueCharacteristic(dataPoints);
            this._maxValueCharacteristic = new MaxValueCharacteristic(dataPoints);
            this._standardDeviationCharacteristic = new StandardDeviationCharacteristic(dataPoints);
        }
        PeakFactorCharacteristic.prototype.calculateInternal = function (startPoint, endPoint) {
            var maxValue = this._maxValueCharacteristic.calculate(startPoint, endPoint);
            var minValue = this._minValueCharacteristic.calculate(startPoint, endPoint);
            var standardDeviation = this._standardDeviationCharacteristic.calculate(startPoint, endPoint);
            var peakFactor = Math.max(Math.abs(maxValue), Math.abs(minValue)) / standardDeviation;
            return peakFactor;
        };
        return PeakFactorCharacteristic;
    })(CharacteristicBase);
    var PeekToPeekCharacteristic = (function (_super) {
        __extends(PeekToPeekCharacteristic, _super);
        function PeekToPeekCharacteristic(dataPoints) {
            _super.call(this, dataPoints);
            this._minValueCharacteristic = new MinValueCharacteristic(dataPoints);
            this._maxValueCharacteristic = new MaxValueCharacteristic(dataPoints);
        }
        PeekToPeekCharacteristic.prototype.calculateInternal = function (startPoint, endPoint) {
            var maxValue = this._maxValueCharacteristic.calculate(startPoint, endPoint);
            var minValue = this._minValueCharacteristic.calculate(startPoint, endPoint);
            return maxValue - minValue;
        };
        return PeekToPeekCharacteristic;
    })(CharacteristicBase);
    var StandardDeviationCharacteristic = (function (_super) {
        __extends(StandardDeviationCharacteristic, _super);
        function StandardDeviationCharacteristic(dataPoints) {
            _super.call(this, dataPoints);
        }
        StandardDeviationCharacteristic.prototype.calculateInternal = function (startPoint, endPoint) {
            var pointNumber = endPoint - startPoint;
            var sum = 0;
            for (var i = startPoint; i < endPoint; ++i) {
                sum += (this.signalData[i].amplitude * this.signalData[i].amplitude);
            }
            sum = sum / pointNumber;
            return Math.sqrt(sum);
        };
        return StandardDeviationCharacteristic;
    })(CharacteristicBase);
})(Dsp || (Dsp = {}));
//# sourceMappingURL=dsp-characteristics.js.map