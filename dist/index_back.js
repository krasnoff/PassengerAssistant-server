"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
// Middlewares
app.use(express_1.default.json());
// Routes
app.get("/", (_req, res) => {
    res.json({ ok: true, message: "Hello from TypeScript + Express 👋" });
});
// Start server
app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
