"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const logging_1 = require("../middleware/logging");
const bookController_1 = require("../controllers/bookController");
const router = express_1.default.Router();
router.use(logging_1.logging);
router.get("/", bookController_1.getAllBooks);
router.post('/addbook', bookController_1.addBook);
router.delete('/deletebook/:isbn', bookController_1.deleteBook);
router.put('/updatebook', bookController_1.updateBook);
exports.default = router;
