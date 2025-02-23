"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logging = void 0;
const logging = (req, res, next) => {
    console.log(`${req.method} request made to: ${req.url}`);
    next();
};
exports.logging = logging;
