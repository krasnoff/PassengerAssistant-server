"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const actions_service_1 = __importDefault(require("../services/actions.service"));
const router = express_1.default.Router();
router.post("/actions", async (req, res, next) => {
    try {
        const result = await actions_service_1.default.returnActionResponse(req.body);
        console.log('Action request:', req.body);
        console.log('Action response:', result);
        // console.log('Action request:', inspect(req.body, { depth: null, colors: true }));
        // console.log('Action response:', inspect(result, { depth: null, colors: true }));
        res.json(result);
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
