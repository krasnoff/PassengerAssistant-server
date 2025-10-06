"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const actions_controller_1 = __importDefault(require("./controllers/actions.controller"));
console.log('let the play begin...');
const server = (0, express_1.default)();
server.use(express_1.default.json());
server.use("/api", actions_controller_1.default);
const port = parseInt(process.env.PORT) || 80;
server.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
