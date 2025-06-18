"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.TemporalEditionService = void 0;
var events_1 = require("events");
var logger_1 = require("../logger");
var TemporalEditionService = /** @class */ (function (_super) {
    __extends(TemporalEditionService, _super);
    function TemporalEditionService(monitoringService, riddler, steward) {
        var _this = _super.call(this) || this;
        _this.isInitialized = false;
        _this.reportSchedule = null;
        _this.monitoringService = monitoringService;
        _this.riddler = riddler;
        _this.steward = steward;
        // Request recognition on construction
        _this.riddler.requestRecognition({
            id: steward.id,
            type: steward.type,
            name: steward.name
        });
        return _this;
    }
    TemporalEditionService.prototype.initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        logger_1.logger.info('Initializing Temporal Edition Service...');
                        return [4 /*yield*/, this.monitoringService.initialize()];
                    case 1:
                        _a.sent();
                        this.setupReportScheduling();
                        this.isInitialized = true;
                        logger_1.logger.info('Temporal Edition Service initialized successfully');
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        logger_1.logger.error('Failed to initialize Temporal Edition Service:', error_1);
                        throw error_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TemporalEditionService.prototype.setupReportScheduling = function () {
        var _this = this;
        var now = new Date();
        var midnight = new Date(now);
        midnight.setHours(24, 0, 0, 0);
        var timeUntilMidnight = midnight.getTime() - now.getTime();
        this.reportSchedule = setInterval(function () {
            _this.generateAndExportReports();
        }, 24 * 60 * 60 * 1000);
        setTimeout(function () {
            _this.generateAndExportReports();
        }, timeUntilMidnight);
    };
    TemporalEditionService.prototype.generateAndExportReports = function () {
        return __awaiter(this, void 0, void 0, function () {
            var metrics, reportData, error_2;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.riddler.checkpoint(this.steward.id, 'generateAndExportReports')) {
                            logger_1.logger.warn('Riddler denied report generation for steward:', this.steward.id);
                            return [2 /*return*/];
                        }
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 5, , 6]);
                        logger_1.logger.info('Generating temporal reports...');
                        return [4 /*yield*/, this.monitoringService.getSystemMetrics()];
                    case 2:
                        metrics = _b.sent();
                        _a = {
                            timestamp: Date.now(),
                            metrics: metrics
                        };
                        return [4 /*yield*/, this.getCurrentState()];
                    case 3:
                        reportData = (_a.state = _b.sent(),
                            _a);
                        return [4 /*yield*/, this.exportReports(reportData)];
                    case 4:
                        _b.sent();
                        logger_1.logger.info('Reports generated and exported successfully');
                        return [3 /*break*/, 6];
                    case 5:
                        error_2 = _b.sent();
                        logger_1.logger.error('Failed to generate reports:', error_2);
                        throw error_2;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    TemporalEditionService.prototype.getCurrentState = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, {}];
            });
        });
    };
    TemporalEditionService.prototype.exportReports = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!this.riddler.checkpoint(this.steward.id, 'exportReports', data)) {
                    logger_1.logger.warn('Riddler denied report export for steward:', this.steward.id);
                    return [2 /*return*/];
                }
                logger_1.logger.info('Exporting reports...');
                return [2 /*return*/];
            });
        });
    };
    TemporalEditionService.prototype.shutdown = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        logger_1.logger.info('Shutting down Temporal Edition Service...');
                        if (this.reportSchedule) {
                            clearInterval(this.reportSchedule);
                        }
                        return [4 /*yield*/, this.saveState()];
                    case 1:
                        _a.sent();
                        this.isInitialized = false;
                        logger_1.logger.info('Temporal Edition Service shut down successfully');
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        logger_1.logger.error('Failed to shut down Temporal Edition Service:', error_3);
                        throw error_3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TemporalEditionService.prototype.saveState = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                logger_1.logger.info('Saving final state...');
                return [2 /*return*/];
            });
        });
    };
    return TemporalEditionService;
}(events_1.EventEmitter));
exports.TemporalEditionService = TemporalEditionService;
