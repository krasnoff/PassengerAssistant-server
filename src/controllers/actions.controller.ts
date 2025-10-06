import express, { NextFunction, Request, Response } from "express";
import actionsService from "../services/actions.service";

const router = express.Router();

router.post("/actions", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await actionsService.returnActionResponse(req.body);
    // console.log('Action request:', req.body);
    // console.log('Action response:', result);
    // console.log('Action request:', inspect(req.body, { depth: null, colors: true }));
    // console.log('Action response:', inspect(result, { depth: null, colors: true }));
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
