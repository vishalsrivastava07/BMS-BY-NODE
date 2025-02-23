"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class response {
    constructor(statusCode, data, message) {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;
    }
}
exports.default = response;
