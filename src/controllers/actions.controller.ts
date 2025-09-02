import express, { NextFunction, Request, Response } from "express";
import actionsService from "../services/actions.service";

const router = express.Router();

router.post("/actions", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await actionsService.returnActionResponse(req.body.messages);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
