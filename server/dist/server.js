"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./configs/instrument.mjs");
const express_1 = __importDefault(require("express"));
const express_2 = require("@clerk/express");
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const clerk_1 = __importDefault(require("./controllers/clerk"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)());
app.post('/api/clerk', express_1.default.raw({ type: 'application/json' }), clerk_1.default);
app.use(express_1.default.json());
app.use((0, express_2.clerkMiddleware)());
app.get("/", (req, res) => {
    res.send("Server is Live!");
});
app.get("/debug-sentry", function mainHandler(req, res) {
    throw new Error("My first Sentry error!");
});
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
