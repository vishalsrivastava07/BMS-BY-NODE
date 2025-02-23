"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const errorHandler_1 = require("./middleware/errorHandler");
const logger_1 = require("./middleware/logger");
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// Middleware
app.use(express_1.default.json());
app.use(logger_1.requestLogger);
app.use(logger_1.customLogger);
// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Express TypeScript API' });
});
app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy' });
});
// Error handling middleware should be last
app.use(errorHandler_1.errorHandler);
// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
