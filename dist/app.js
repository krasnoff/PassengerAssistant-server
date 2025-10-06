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
server.listen(3000, '0.0.0.0', () => {
    console.log('Server is running on http://localhost:3000');
});
