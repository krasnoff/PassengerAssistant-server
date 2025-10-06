import 'dotenv/config';
import express from "express";
import actionsController from "./controllers/actions.controller";

console.log('let the play begin...');

const server = express();

server.use(express.json());
server.use("/api", actionsController);

const port: number = parseInt(process.env.PORT as string) || 80;

server.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
