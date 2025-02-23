"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.customLogger = exports.requestLogger = void 0;
const morgan_1 = __importDefault(require("morgan"));
exports.requestLogger = (0, morgan_1.default)('dev');
const customLogger = (req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
};
exports.customLogger = customLogger;
