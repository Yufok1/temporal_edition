"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
exports.__esModule = true;
exports.stream = void 0;
var winston_1 = require("winston");
var winston_2 = require("winston");
var combine = winston_2.format.combine, timestamp = winston_2.format.timestamp, printf = winston_2.format.printf, colorize = winston_2.format.colorize;
// Custom format for log messages
var logFormat = printf(function (_a) {
    var level = _a.level, message = _a.message, timestamp = _a.timestamp, metadata = __rest(_a, ["level", "message", "timestamp"]);
    var msg = "".concat(timestamp, " [").concat(level, "]: ").concat(message);
    if (Object.keys(metadata).length > 0) {
        msg += " ".concat(JSON.stringify(metadata));
    }
    return msg;
});
// Create the logger instance
var logger = winston_1["default"].createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(timestamp(), logFormat),
    transports: [
        // Console transport for development
        new winston_1["default"].transports.Console({
            format: combine(colorize(), timestamp(), logFormat)
        }),
        // File transport for production
        new winston_1["default"].transports.File({
            filename: 'logs/error.log',
            level: 'error',
            maxsize: 5242880,
            maxFiles: 5
        }),
        new winston_1["default"].transports.File({
            filename: 'logs/combined.log',
            maxsize: 5242880,
            maxFiles: 5
        })
    ]
});
// Create a stream object for Morgan
exports.stream = {
    write: function (message) {
        logger.info(message.trim());
    }
};
exports["default"] = logger;
